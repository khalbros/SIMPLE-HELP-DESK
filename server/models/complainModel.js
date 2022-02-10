import mongoose from "mongoose"
const complainSchema = new mongoose.Schema({
  complain: {type: String, required: true},
  solution: {type: String},
  createdOn: {type: Date, default: Date.now()},
})

const complainModel = mongoose.model("complain", complainSchema)

export default complainModel
