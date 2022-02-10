import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import userRoute from "./routes/userRoute.js"
import adminRoute from "./routes/adminRoute.js"

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors({origin: ["http://localhost:3000"], credentials: true}))
app.use(cookieParser())

app.use("/user", userRoute)
app.use("/admin", adminRoute)

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database Connected Successfully")
      app.listen(port, () => console.log(`Server Running On Port: ${port}`))
    },
    (err) => console.log(err.message)
  )
  .catch((error) => console.log(error.message))
