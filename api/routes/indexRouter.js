import apiLimiter from '../../middleware/limitRate.js'
import productsRoutes from './product.js'
import express from 'express'

const indexRouter = express.Router()

indexRouter.use(apiLimiter)

indexRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'API running perfect',
    documentation: 'Refer to endpoint /'
  })
})

indexRouter.use('/products', productsRoutes)

export default indexRouter
