import JWT from "jsonwebtoken"

async function userAuth(req, res, next) {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.send({Error: "Unathorized"})
    }
    const verify = JWT.verify(token, process.env.JWTKEY)
    if (!verify) {
      return res.send({Error: "Unathorized"})
    }
    req.user = verify.user
    next()
  } catch (error) {
    res.send({Error: error.message})
  }
}

export default userAuth
