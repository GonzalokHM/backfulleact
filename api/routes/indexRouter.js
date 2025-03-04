import apiLimiter from '../../middleware/limitRate.js'
import productsRoutes from './product.js'
import authRoutes from './auth.js'
import express from 'express'

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
