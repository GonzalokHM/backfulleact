import express from 'express'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlist'

const wishlistRoutes = express.Router()

wishlistRoutes.get('/:userId', [isAuth], getWishlist)
wishlistRoutes.post('/', [isAuth], addToWishlist)
wishlistRoutes.delete('/:id', [isAuth], removeFromWishlist)

export default wishlistRoutes
