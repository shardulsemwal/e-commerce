import userModel from "../models/userModel.js";
import validator from "validator";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const normalizeValue = (value) => {
    return String(value ?? "")
        .trim()
        .replace(/^['"]|['"]$/g, "");
};

// Route for user Login
const loginUser = async (req, res) => {
    console.log("login api called");
    try{
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email });

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            res.json({success: true, token});
        }else{                                                                                                              
            res.json({success: false, message: "Invalid credentials"});
        }

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Route for user register
const registerUser = async (req, res) => {
     console.log("register api called");
    try{

        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email});

        if(exists){
            return res.json({success: false, message: "User already exists"});
        }

        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Invalid email"});
        }
        if(password.length < 8){
            return res.json({success: false, message: "Password must be at least 8 characters long"});
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success: true, token});

    
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


// Route for admin Login
const adminLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        const inputEmail = normalizeValue(email);
        const inputPassword = normalizeValue(password);
        const adminEmail = normalizeValue(process.env.ADMIN_EMAIL);
        const adminPassword = normalizeValue(process.env.ADMIN_PASSWORD);

        if(inputEmail === adminEmail && inputPassword === adminPassword){
            const token = jwt.sign(
                { email: adminEmail, role: "admin" },
                process.env.JWT_SECRET
            );
            res.json({success: true, token});
        }else{
            res.json({success: false, message: "Invalid credentials"});
        }
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export { loginUser, registerUser, adminLogin }
