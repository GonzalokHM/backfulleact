// import {isAuth, isVip} from '../../middleware/auth.js'
import { isAuth, isVip } from '../../middlewares/auth'
import {
  filterProducts,
  getProductByASIN,
  getProducts,
  getTopSellingPerCategory,
  getUniqueProductPerCategory,
  vipSearch
} from '../controllers/product'
import express from 'express'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)
productsRoutes.get('/filter', filterProducts)
productsRoutes.get('/unique', getUniqueProductPerCategory)
productsRoutes.get('/top', getTopSellingPerCategory)
productsRoutes.get('/asin/:asin', [isAuth], getProductByASIN)
productsRoutes.get('/vipSearch', [isAuth, isVip], vipSearch)

export default productsRoutes
