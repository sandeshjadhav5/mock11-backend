const express = require("express");
const { UserModel } = require("../models/User.model");
require("dotenv").config();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// R E G I S T R A T I O N

userRouter.post("/register", async (req, res) => {
  const { image, name, bio, phone, email, password } = req.body;

  try {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({
          image,
          name,
          bio,
          phone,
          email,
          password: hashedPassword,
        });

        await user.save();
        res.send("User Registered Successfully");
      }
    });
  } catch (err) {
    res.send("Registration Failed");
    console.log(err);
  }
});

//L O G I N

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      const hashedPassword = user[0].password;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userID: user[0]._id },
            `${process.env.key}`,
            {
              expiresIn: "2h",
            }
          );
          res.send({ msg: "Login Successfull", token: token });
        } else {
          res.send("Wrong Credentials");
        }
      });
    } else {
      res.send("Login Failed");
    }
  } catch (err) {
    res.send("Something Went Wrong");
    console.log(err);
  }
});

//GET PROFILE DETAILS
userRouter.get("/getProfile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findOne({ _id: userId });
    res.send(user);
  } catch (err) {
    res.send("profile fetching failed");
    console.log(err);
  }
});

//UPDATE PROFILE DETAILS
userRouter.patch("/editProfileDetails/:userID", async (req, res) => {
  const userId = req.params.userID;

  const payload = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { ...payload }
    );
    res.send(user);
  } catch (err) {
    res.send("Error Updating User Details");
    console.log(err);
  }
});

module.exports = {
  userRouter,
};
