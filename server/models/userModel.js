import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  regnumber: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  phone: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default: "Student"},
  createdOn: {type: Date, default: Date.now()},
})

const userModel = mongoose.model("user", userSchema)

export default userModel
