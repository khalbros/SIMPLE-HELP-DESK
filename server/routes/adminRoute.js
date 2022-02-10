import express from "express"
import JWT from "jsonwebtoken"
import bcrypt from "bcrypt"
import adminModel from "../models/adminModel.js"
import userModel from "../models/userModel.js"
import faqModel from "../models/faqModel.js"
import complainModel from "../models/complainModel.js"
import adminAuth from "./adminAuth.js"

const route = express.Router()

// Create New Admin

route.post("/register", adminAuth, async (req, res) => {
  const {name, email, password} = req.body
  try {
    if (!name || !email || !password) {
      return res.send({Error: "Fields Error"})
    }
    const emailCheck = await adminModel.findOne({email})
    if (emailCheck) {
      return res.send({Error: "Email already exist"})
    }
    const SALT = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, SALT)
    const admin = await adminModel({name, email, password: passwordHash}).save()
    res.send({"Successfully Added": admin})
  } catch (error) {
    return res.send({Error: "Server Error"})
  }
})

// Admin Login

route.post("/login", async (req, res) => {
  const {email, password} = req.body
  try {
    if (!email || !password) {
      return res.send({Error: "Some Fields Empty"})
    }
    const emailCheck = await adminModel.findOne({email})
    if (!emailCheck) {
      return res.send({Error: "Invalid Credentials"})
    }
    const hashPassword = await bcrypt.compare(password, emailCheck.password)
    if (!hashPassword) {
      return res.send({Error: "Invalid Credentials"})
    }
    const token = JWT.sign(
      {user: emailCheck.email, role: emailCheck.role},
      process.env.JWTKEY
    )

    res
      .cookie("token", token, {httpOnly: true})
      .send({Success: "Login Succesfully as " + emailCheck.email})
  } catch (error) {
    return res.send({Error: "Login Error"})
  }
})

// LogOut

route.get("/logout", async (req, res) => {
  try {
    res
      .cookie("token", "", {expires: new Date(0), httpOnly: true})
      .send({Success: "Logout from "})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

// Check if Loged In or Out

route.get("/islogedin", async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.send({active: false, role: "no cookie"})
    }
    const verify = JWT.verify(token, process.env.JWTKEY)
    if (!verify) {
      return res.send({active: false, role: "invalid cookie"})
    }
    return res.send({active: true, role: verify.role})
  } catch (error) {
    return res.send({active: false, role: error.message})
  }
})

// Fetch all Admins

route.get("/admin", adminAuth, async (req, res) => {
  try {
    const admin = await adminModel.find()
    res.send(admin)
  } catch (error) {
    res.send({Error: error.message})
  }
})

// Fetch all Users/Students

route.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await userModel.find()
    res.send(users)
  } catch (error) {
    res.send({Error: error.message})
  }
})

// Add User / Students

route.post("/add-user", adminAuth, async (req, res) => {
  const {name, regnumber, email, phone, password} = req.body
  try {
    if (!name || !regnumber || !email || !phone || !password) {
      return res.send({Error: errors.message})
    }
    const emailCheck = await userModel.findOne({email})
    const regnumberCheck = await userModel.findOne({regnumber})
    const phoneCheck = await userModel.findOne({phone})
    if (emailCheck) {
      return res.send({Error: "Email already exist"})
    }
    if (regnumberCheck) {
      return res.send({Error: "Registration number already exist"})
    }
    if (phoneCheck) {
      return res.send({Error: "Phone number already exist"})
    }
    const SALT = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, SALT)
    const user = await new userModel({
      name,
      regnumber,
      email,
      phone,
      hashPassword,
    }).save()
    return res.send({Message: "User Created", User: user})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

// Delete User / Student

route.delete("/delete-user/:id", adminAuth, async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({_id: req.params.id})
    res.send({Deleted: user})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

// Fetch all Frequent Ask Questions

route.get("/faq", adminAuth, async (req, res) => {
  try {
    const faq = await faqModel.find()
    res.send(faq)
  } catch (error) {
    res.send({Error: error.message})
  }
})

// Add FAQ

route.post("/add-faq", adminAuth, async (req, res) => {
  const {question, answer} = req.body
  try {
    if (!question || !answer) {
      return res.send({Error: errors.message})
    }
    const faq = await faqModel({question, answer}).save()
    res.send({Message: "FAQ Added Success", FAQ: faq})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

// Delete FAQ

route.delete("/delete-faq/:id", adminAuth, async (req, res) => {
  try {
    const faq = await faqModel.findOneAndDelete({_id: req.params.id})
    res.send({Deleted: faq})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

// Fetch all Complains

route.get("/complains", adminAuth, async (req, res) => {
  try {
    const complains = await complainModel.find()
    res.send(complains)
  } catch (error) {
    res.send({Error: error.message})
  }
})

// Answer Complain

route.post("/answer-complain/:id", adminAuth, async (req, res) => {
  const {solution} = req.body
  try {
    if (!solution) {
      return res.send({Error: errors.message})
    }
    const complain = await complainModel.findOne({_id: req.params.id})
    complain.solution = solution
    await complain.save()
    res.send({Success: "Updated Successfully"})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

export default route
