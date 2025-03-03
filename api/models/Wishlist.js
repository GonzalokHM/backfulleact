import mongoose from 'mongoose'

const WishlistSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ASIN: { type: String, required: true }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema)

export default Wishlist
