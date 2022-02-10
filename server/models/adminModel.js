import mongoose from "mongoose"
const adminSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, default: "Admin"},
  createdOn: {type: Date, default: Date.now()},
})

const adminModel = mongoose.model("admin", adminSchema)

export default adminModel
