import apiLimiter from '../../middlewares/limitRate.js'
import productsRoutes from './product.js'
import authRoutes from './auth.js'
import express from 'express'
import categoriesRoutes from './category.js'
import wishlistRoutes from './wishlist.js'
import userRoutes from './user.js'

const indexRouter = express.Router()

indexRouter.use(apiLimiter)

indexRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'API running perfect',
    documentation: 'Refer to endpoint /products /categories'
  })
})

indexRouter.use('/products', productsRoutes)
indexRouter.use('/auth', authRoutes)
indexRouter.use('/categories', categoriesRoutes)
indexRouter.use('/wishlist', wishlistRoutes)
indexRouter.use('/users', userRoutes)

export default indexRouter
