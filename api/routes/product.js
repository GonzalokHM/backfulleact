import { isAuth, isVip } from '../../middlewares/auth.js'
import {
  filterProducts,
  getProductByASIN,
  getProductById,
  getProducts,
  getTopSellingPerCategory,
  getUniqueProductPerCategory,
  vipSearch
} from '../controllers/product.js'
import express from 'express'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)
productsRoutes.get('/id/:id', getProductById)
productsRoutes.get('/filter', filterProducts)
productsRoutes.get('/unique', getUniqueProductPerCategory)
productsRoutes.get('/top', getTopSellingPerCategory)
productsRoutes.get('/asin/:asin', getProductByASIN)
productsRoutes.get('/vipSearch', [isAuth, isVip], vipSearch)

export default productsRoutes
