import express from 'express'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlist'

const wishlistRoutes = express.Router()

wishlistRoutes.get('/:userId', getWishlist)
wishlistRoutes.post('/', addToWishlist)
wishlistRoutes.delete('/:id', removeFromWishlist)

export default wishlistRoutes
