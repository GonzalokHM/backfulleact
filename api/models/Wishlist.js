import mongoose from 'mongoose'

const WishlistSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema)

export default Wishlist
