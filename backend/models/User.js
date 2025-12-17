import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    minlength: [3,"Username must be at least 3 characters long"],
  },
  email:{
    type: String,
    required: [true,"Please enter an email address"],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Please enter a valid email address"],
  },
  password:{
    type: String,
    required: [true,"Please enter a password"],
    trim: true,
    minlength: [3,"Password must be at least 3 characters long"],
    select: false,
  },
  profileImage:{
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
},{timestamps: true})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;


