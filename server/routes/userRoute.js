import express from "express"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js"
import complainModel from "../models/complainModel.js"
import faqModel from "../models/faqModel.js"
import userAuth from "./userAuth.js"

const route = express.Router()

route.post("/register", async (req, res) => {
  const newUser = {
    name: req.body.name,
    regnumber: req.body.regnumber,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  }

  try {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.regnumber ||
      !newUser.phone ||
      !newUser.password
    ) {
      res.send({Error: "Invalid Field"})
    }
    const emailCheck = await userModel.findOne({email: newUser.email})
    const regnumberCheck = await userModel.findOne({
      regnumber: newUser.regnumber,
    })
    const phoneCheck = await userModel.findOne({phone: newUser.phone})
    if (emailCheck) {
      return res.send({Error: "Email already exist"})
    }
    if (phoneCheck) {
      return res.send({Error: "Phone number already exist"})
    }
    if (regnumberCheck) {
      return res.send({Error: "Registration number already exist"})
    }
    const SALT = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newUser.password, SALT)
    const user = await new userModel({
      ...newUser,
      password: hashPassword,
    }).save()
    const token = JWT.sign(
      {user: newUser.email, role: "Student"},
      process.env.JWTKEY
    )

    res
      .cookie("token", token, {httpOnly: true})
      .send({Success: "Register Success"})
  } catch (error) {
    res.send({Error: error.message})
  }
})

route.post("/login", async (req, res) => {
  const {email, password} = req.body
  try {
    if (!email || !password) {
      return res.send({Error: "Invalid Credentials"})
    }
    const userCheck = await userModel.findOne({email})
    if (!userCheck) {
      return res.send({Error: "Invalid Credentials"})
    }
    const hashPassword = userCheck.password
    const pwd = await bcrypt.compare(password, hashPassword)
    if (!pwd) {
      return res.send({Error: "Invalid Credentials"})
    }
    const token = JWT.sign(
      {user: userCheck.email, role: userCheck.role},
      process.env.JWTKEY
    )

    res
      .cookie("token", token, {httpOnly: true})
      .send({Success: "Login Successfully"})
  } catch (error) {
    res.send({Errror: error.message})
  }
})

route.get("/logout", (req, res) => {
  res
    .cookie("token", "", {httpOnly: true, expires: new Date(0)})
    .send({message: "Loged Out... "})
})

route.get("/islogedin", async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.send({active: false})
    }
    const verify = JWT.verify(token, process.env.JWTKEY)
    if (!verify) {
      return res.send({active: false})
    }
    return res.send({active: true, role: verify.role})
  } catch (error) {
    return res.send({active: false})
  }
})

route.get("/faq", async (req, res) => {
  try {
    const faq = await faqModel.find()
    res.send(faq)
  } catch (error) {
    res.send({Error: error.message})
  }
})

route.get("/complains", userAuth, async (req, res) => {
  try {
    const complains = await complainModel.find()
    res.send(complains)
  } catch (error) {
    res.send({Error: error.message})
  }
})

route.post("/add-complain", userAuth, async (req, res) => {
  const {complain} = req.body
  try {
    if (!complain) {
      return res.send({Error: errors.message})
    }
    await complainModel({complain}).save()
    res.send({Success: "Complain Submited"})
  } catch (error) {
    return res.send({Error: error.message})
  }
})

export default route
