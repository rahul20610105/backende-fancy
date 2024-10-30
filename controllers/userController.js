import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user login
const loginUser=async(req,res)=>{
try{
const{email,password}=req.body;

const user=await User.findOne({email});
if (!user){
   return res.json({success:false,message:"invalid email"})
}

const isMatch= await bcrypt.compare(password,user.password)

if (isMatch){
    const token=createToken(user._id)
    res.json({success:true,token})
}else{
    return res.json({success:false,message:"invalid password"})
}


} catch(error){
console.log(error)
res.json({success:false,message:"error occured. try again "})
}



};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { username, email, password, name, isAdmin, adminKey } = req.body;

        // Check if the email already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists." });
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Please enter a strong password." });
        }

        // Verify admin key if registering as an admin
        if (isAdmin && adminKey !== process.env.ADMIN_KEY) {
            console.log("Provided admin key:", adminKey);  // To debug the input value
            console.log("Expected admin key:", process.env.ADMIN_KEY);  // To debug the env value
            return res.status(403).json({ success: false, message: "Invalid admin key." });
        }
        

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, name, isAdmin });
        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.json({ success: false, message: "Error occurred. Please try again." });
    }
};



//route for admn login 
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (!user.isAdmin) {
            return res.json({ success: false, message: "Access denied. Admin only." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid password" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred. Try again" });
    }
};


export {loginUser,registerUser,adminLogin}