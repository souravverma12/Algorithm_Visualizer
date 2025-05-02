// const mongoose=require('mongoose');
// const bcrypt=require('bcrypt')

// // ============Google Authentication===================

// const userSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     email:{type: String, unique: true,required:true},
//     registration_type:{
//         type:String,
//         default:"Local"
//     },
//     google_id:String,
//     avatar:{
//         type:String,
//         default:'avatar.png'
//     },
//     registration_date:{
//         type:Date,
//         default:Date.now()
//     }
// })
// userSchema.pre('save',async function(next){
//     if(this.isModified('password')){ //only hash the password if it has been modified (or is new)
//        await bcrypt.hash(this.password,10).then(hash=>{
//         this.password=hash;
//         next();
//        }).catch(err=>next(err))
//     }
//     next();
// })

// module.exports=mongoose.model('users',userSchema);



const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    registration_type: {
        type: String,
        enum: ['Local', 'Google'],
        default: 'Local'
    },
    google_id: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: 'avatar.png'
    },
    registration_date: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (only if it's new or modified)
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const hash = await bcrypt.hash(this.password, 10);
            this.password = hash;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Optional method to compare passwords (for login logic)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', userSchema);
