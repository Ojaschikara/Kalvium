const express = require("express");
const path = require("path");
const fs = require("fs");


const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user");
require("dotenv").config();
const { isAuthenticatedUser } = require('../middleware/auth');


// router.post("/create-user", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
//     console.log("Creating user...");
//     try {
//         const { name, email, password } = req.body;

//         const userEmail = await UserModel.findOne({ email });
//         if (userEmail) {
//             if (req.file) {
//                 const filepath = path.join(__dirname, "../uploads", req.file.filename);
//                 try {
//                     fs.unlinkSync(filepath);
//                 } catch (err) {
//                     console.log("Error removing file:", err);
//                     return res.status(500).json({ message: "Error removing file" });
//                 }
//             }
//             return next(new ErrorHandler("UserModel already exists", 400));
//         }
    
//         let fileUrl = "";
//         if (req.file) {
//             fileUrl = path.join("uploads", req.file.filename);
    
//         }
//         // bcrypt.hash(password, 4 , async (err, hash) => {
//         //     if (err) {
//         //       return res.status(500).send("Error in hashing password.");
//         //     }
      
//         //     const newUser = new UserModel({
//         //       username,
//         //       email,
//         //       password: hash,
//         //       phone,
//         //       ZIP,
//         //     });
      
//         //     await newUser.save();
      
//         //     res.status(201).send({
//         //       message: `Congratulations ${username} you are registered`,
//         //       "UserModel": newUser,
//         //     });
//         //   });
//         const hashedPassword = await bcrypt.hash(password, 2, async (err, hash) => {
//                 if (err) {
//                   return res.status(500).send("Error in hashing password.");
//                 }
//                 console.log("At Create ", "Password: ", password, "Hash: ", hashedPassword);
//                 const user = UserModel.create({
//                     name,
//                     email,
//                     password: hash,
//                     avatar: {
//                         public_id: req.file?.filename || "",
//                         url: fileUrl,
//                     },
//                 });
//                 await user.save()
//                 console.log(user)
//                 res.status(201).json({ success: true, user });
            
//             });
//     } catch (error) {
//         console.log("error in signup",error)
//     }
   
   
// }));

// router.post("/login", catchAsyncErrors(async (req, res, next) => {
//     console.log("Logging in user...");
//     // const { email, password } = req.body;
//     // if (!email || !password) {
//     //     return next(new ErrorHandler("Please provide email and password", 400));
//     // }
//     // console.log(email,password)
//     // const user = await UserModel.findOne({ email }).select("+password");
//     // if (!user) {
//     //     return next(new ErrorHandler("Invalid Email or Password", 401));
//     // }
//     // if(user){
//     // await bcrypt.compare(password, user.password, function(err, result) {
//     //     // result == true
//     //     if(err){
//     //         console.log("error in password",err)
//     //         return next(new ErrorHandler("Invalid Email or Password", 401));
//     //     }else{
//     //     const token = jwt.sign(
//     //         { id: user._id, email: user.email },
//     //         process.env.JWT_SECRET || "your_jwt_secret",
//     //         { expiresIn: "1h" }
//     //     );
    
//     //     // Set token in an HttpOnly cookie
//     //     res.cookie("token", token, {
//     //         httpOnly: true,
//     //         secure: process.env.NODE_ENV === "production", // use true in production
//     //         sameSite: "Strict",
//     //         maxAge: 3600000, // 1 hour
//     //     });
//     //     user.password = undefined; // Remove password from response
//     //     res.status(200).json({
//     //         success: true,
//     //         user,
//     //     });}

//     // });}
//     // // console.log("At Auth", "Password: ", password, "Hash: ", user.password);
//     // // if (!isPasswordMatched) {

//     // //     return next(new ErrorHandler("Invalid Email or Password", 401));
//     // // }
//     //  // Generate JWT token
    
//     try {
//         const user = await UserModel.findOne({ email });
    
//         if (!user) {
//           return res.status(401).send({ message: `Wrong Email, Register first` });
//         }
//         bcrypt.compare(password, user.password, async (err, result) => {
//           if (err) {
//             return res
//               .status(500) 
//               .send({ message: `Error in Comparing password: ${err.message}` });
//           }
    
//           if (result) {
//             const token = jwt.sign(
//               {
//                 username: user.username,
//                 email: user.email,
//                 phone: user.phone,
//                 userID: user._id,
//               },
//               process.env.JWT_SECRET
//             );
    
//             res.status(200).send({ message: "Login successful", "token": token, user });
//           }
//         });
//       } catch (error) {
//         res.status(500).send({ message: `Wrong Credentials: ${error.message}` });
//       }
    
   
// }));

router.post("/create-user", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
        // Delete uploaded file if user already exists
        if (req.file) {
            const filepath = path.join(__dirname, "../uploads", req.file.filename);
            fs.unlinkSync(filepath);
        }
        return next(new ErrorHandler("UserModel already exists", 400));
    }

    const fileUrl = req.file ? path.join("uploads", req.file.filename) : "";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds recommended

    const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        avatar: {
            public_id: req.file?.filename || "",
            url: fileUrl,
        },
    });

    await user.save();

    res.status(201).json({
        success: true,
        user,
    });
}));

router.post("/login", catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    console.log(user.password,user.name)
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log(isMatch)
    if (!isMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
    );

    // Set token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000,
    });

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user,
    });
}));



router.get("/profile",isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
    const { userEmail } = req.query;
    console.log(req.query.userEmail)
    if (!userEmail) {
        return next(new ErrorHandler("Please provide an userEmail", 400));
    }
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
        return next(new ErrorHandler("UserModel not found", 404));
    }
    res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatar.url
        },
        addresses: user.addresses,
    });
}));

router.post("/add-address",isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
    const { country, city, address1, address2, zipCode, addressType, email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("UserModel not found", 404));
    }

    const newAddress = {
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
        success: true,
        addresses: user.addresses,
    });
}));


router.get("/addresses",isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("UserModel not found", 404));
    }
    res.status(200).json({
        success: true,
        addresses: user.addresses,
    });
}
));


module.exports = router;