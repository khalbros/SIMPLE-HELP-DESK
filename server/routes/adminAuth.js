import JWT from "jsonwebtoken"

async function adminAuth(req, res, next) {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.send({Error: "Unathorized"})
    }
    const verify = JWT.verify(token, process.env.JWTKEY)
    if (!verify) {
      return res.send({Error: "Unathorized"})
    }
    if (verify.role != "Admin") {
      return res.send({Error: "Unathorized"})
    }
    req.user = verify.user
    req.role = verify.role

    next()
  } catch (error) {
    res.send({Error: error.message})
  }
}

export default adminAuth
