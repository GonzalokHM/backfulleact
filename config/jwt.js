import jwt from 'jsonwebtoken'

const generateSign = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

const verifyJwt = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY)
}

export { generateSign, verifyJwt }
