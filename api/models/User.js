import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    vip: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'users' }
)

const User = mongoose.model('User', UserSchema)

export default User
