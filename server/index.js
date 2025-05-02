const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./Database/Userschema');
const Que_ans = require('./Database/Questionschema');
const bcrypt = require('bcrypt');
const jwtkey = 'e-commerce';
const PORT = process.env.PORT || 4001;
const PortalURL = 'http://localhost:3000';
require('./Database/MongoConnect');
require('./Passport/googleauth');

const app = express();

// CORS configuration with expanded options
const corsOptions = {
  origin: PortalURL, // Using the PortalURL variable for consistency
  credentials: true, // Important for cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS with the more detailed configuration
app.use(cors(corsOptions));

// Session configuration - modified to be secure only in production
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' // Helps with CORS issues for cookies
  }
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// =========================== verifying JWT Token as Middleware==========
const verifyingJWT = (req, resp, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return resp.status(401).send({ Error: "No authorization token provided, please login again." });
  }
  
  jwt.verify(token, jwtkey, (err, valid) => {
    if (err) {
      resp.status(401).send({ Error: err.message + ", Please login again." });
    }
    else {
      req.body.userid = valid.user._id;
      req.body.name = valid.user.name;
      next();
    }
  });
};

// ================================Google Authentication===================
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/failure' }), async (req, resp) => {
    const user = req.user;
    jwt.sign({ user }, jwtkey, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        resp.redirect(`${PortalURL}/login?Error=${err.message}`);
      } else {
        resp.redirect(`${PortalURL}/Authenticate?auth=${token}&name=${req.user.name}&email=${req.user.email}&avatar=${req.user.avatar}`);
      }
    });
  }
);

// ==================Checking User login with google ================
app.get('/login/failure', (req, resp) => {
  resp.status(401).send({ Error: 'Login failed. Please try again.' });
});

// ================================== Sign up====================
app.post('/api/signup', async (req, resp) => {
  try {
    const data = new User(req.body);
    const result = await data.save();
    
    let user = result.toObject();
    delete user.password;
    
    jwt.sign({ user }, jwtkey, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        resp.status(401).send({ Error: 'Something went wrong, please try again.' });
      } else {
        resp.status(200).send({ user, auth: token, Error: false });
      }
    });
  } catch (err) {
    resp.status(403).send({ Error: "Email id already exists, please login." });
  }
});

// ================================== Login====================
app.post('/api/login', async (req, resp) => {
  try {
    let Email = req.body.email;
    let Password = req.body.password;
    
    let user = await User.findOne({ email: Email }, { registration_type: 1, password: 1, name: 1, email: 1, avatar: 1 });
    
    if (!user) {
      return resp.status(401).send({ Error: "Email ID not found." });
    }
    
    if (user.registration_type == 'Local') {
      const Hash_Pass = user.password;
      
      const valid = await bcrypt.compare(Password, Hash_Pass);
      
      if (valid) {
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj._id;
        
        jwt.sign({ user }, jwtkey, { expiresIn: '1h' }, (err, token) => {
          if (err) {
            resp.status(401).send({ Error: 'Something went wrong.' });
          } else {
            resp.status(200).send({ user: userObj, auth: token, Error: false });
          }
        });
      } else {
        resp.status(401).send({ Error: 'Password is incorrect.' });
      }
    } else {
      resp.status(401).send({ Error: "Please choose 'Continue with Google option'" });
    }
  } catch (err) {
    resp.status(500).send({ Error: 'Server issue, please try again later.' });
  }
});

// ============================ Question Post/ Ask a question======================
app.post('/api/postquestion', verifyingJWT, async (req, resp) => {
  try {
    const que = new Que_ans(req.body);
    await que.save();
    resp.status(200).send({ Message: "Successfully posted", Error: false });
  } catch (err) {
    resp.status(400).send({ Error: "Failed to post Question" });
  }
});

//======================== Getting all Questions===========================
app.post('/api/allquestion', async (req, resp) => {
  try {
    const pagename = req.body.pagename;
    const result = await Que_ans.find({ pagename: pagename }).sort({ _id: -1 });
    resp.status(200).send({ data: result, Error: false });
  } catch (err) {
    resp.status(400).send({ Error: err.message });
  }
});

// ==================== Reply / Answer post=============================
app.post('/api/postreply', verifyingJWT, async (req, resp) => {
  try {
    const queid = req.body.queid;
    const userid = req.body.userid;
    const username = req.body.name;
    const answer = req.body.reply;
    
    if (!answer || !username) {
      return resp.status(400).send({ Error: "Please fill the answer." });
    }
    
    const question = await Que_ans.findOne({ _id: queid }, { _id: 0, answer: 1 });
    
    if (!question) {
      return resp.status(404).send({ Error: "Question not found" });
    }
    
    let oldreply = question.answer || {};
    let index = Object.keys(oldreply).length + 1;
    
    oldreply[index] = {
      ans_userid: userid,
      ans_name: username,
      reply: answer
    };
    
    const updateResult = await Que_ans.updateOne(
      { _id: queid }, 
      { $set: { answer: oldreply } }
    );
    
    if (updateResult.acknowledged) {
      resp.status(200).send({ Message: "Successfully posted reply", Error: false });
    } else {
      resp.status(400).send({ Error: "Failed to post reply" });
    }
  } catch (err) {
    resp.status(500).send({ Error: "Server error. Please try again." });
  }
});

// ========================================= Logout ===========
app.get('/api/logout', (req, resp) => {
  req.logout((err) => {
    if (err) {
      return resp.status(500).send({ Error: 'Error during logout' });
    }
    resp.status(200).send({ Message: 'Successfully logged out', Error: false });
  });
});

// ====================== Static Files Serving ==============
app.use(express.static(path.join(__dirname, "client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});