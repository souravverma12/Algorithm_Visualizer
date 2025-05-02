// const passport = require('passport');
// // const Googlekey = require('./keys');
// const dotenv=require('dotenv');
// dotenv.config();
// const User = require('../Database/Userschema');
// // ============Google Authentication===================

// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.Callback
// },
//     async (accessToken, refreshToken, profile, done) => {
//         let data = {
//             name: profile.displayName,
//             password: "Vishalmaurya@8949",
//             email: profile.emails[0].value,
//             registration_type: 'Google',
//             google_id: profile.id,
//             avatar:profile.photos[0].value
//         }
//         const user=await User.findOne({email:data.email})
//         if(user){
//             console.log('Already Exist ',user)
//             done(null, user);
//         }
//         // else{
//         //     const user=await User.create(data);
//         //     console.log("Database crete. ")
//         //     done(null, user);
//         // }
//         else {
//             const newUser = new User(data);
//             await newUser.save(); // This will trigger the pre-save password hash
//             console.log("Database created.");
//             done(null, newUser);
//         }
        
         
//     }
// ));
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//     // User.findById(id, function (err, user) {
//     // });
//     done(null, user);
// });



const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../Database/Userschema');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK // Use GOOGLE_CALLBACK in .env
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            // Check if user already exists
            let user = await User.findOne({ email });

            if (user) {
                console.log('User already exists:', user.name);
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                name: profile.displayName,
                email: email,
                password: Math.random().toString(36).slice(-8), // Dummy password
                registration_type: 'Google',
                google_id: profile.id,
                avatar: profile.photos[0].value
            });

            await newUser.save();
            console.log('New Google user saved to DB:', newUser.name);
            done(null, newUser);
        } catch (err) {
            console.error('Error during Google Auth:', err);
            done(err, null);
        }
    }
));

// Serialize & Deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
