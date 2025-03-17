import bcrypt from 'bcryptjs'
import { generateSign } from '../../config/jwt.js'
import setError from '../../config/error.js'
import User from '../models/User.js'

const register = async (req, res, next) => {
  const { username, email, password } = req.body
  try {
    console.log('📌 Iniciando registro de usuario:', username)
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      console.error('⚠️ Usuario ya existe:', username)
      return next(setError(400, 'El username ya existe'))
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      console.error('⚠️ email ya existe:', email)
      return next(setError(400, 'El email ya existe'))
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('🔐 Contraseña hasheada correctamente')
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()
    return res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('❌ ERROR in REGISTER:', error)
    return next(setError(500, 'Error al registrar el usuario'))
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid email' })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return next(setError(400, 'Invalid Credentials'))

    const token = generateSign(user._id)
    return res.status(200).json({ user, token })
  } catch (error) {
    console.error('❌ ERROR DETECTADO EN REGISTER:', error)
    return next(setError(500, 'Error during login'))
  }
}

export { register, login }
