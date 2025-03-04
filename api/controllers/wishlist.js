import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'
import { setError } from '../helpers/error.js'

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({
      usuario: req.params.userId
    }).populate('producto')
    return res.json(wishlist)
  } catch (error) {
    return next(setError(400, 'Error al obtener la wishlist'))
  }
}

const addToWishlist = async (req, res, next) => {
  try {
    const { usuario, ASIN } = req.body
    const product = await Product.findOne({ ASIN })
    if (!product) return next(setError(404, 'Producto no encontrado'))
    const newWishlistItem = new Wishlist({ usuario, producto: product._id })
    const savedItem = await newWishlistItem.save()
    return res.status(201).json(savedItem)
  } catch (error) {
    return next(setError(400, 'Error al agregar a la wishlist'))
  }
}

const removeFromWishlist = async (req, res, next) => {
  try {
    const removedItem = await Wishlist.findByIdAndDelete(req.params.id)
    if (!removedItem)
      return next(setError(404, 'Elemento no encontrado en la wishlist'))
    return res.json({ message: 'Elemento eliminado de la wishlist' })
  } catch (error) {
    return next(setError(400, 'Error al eliminar de la wishlist'))
  }
}

export { getWishlist, addToWishlist, removeFromWishlist }
