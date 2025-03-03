import Product from '../models/Product'

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category')
    return res.status(200).json(products)
  } catch (error) {
    return next(setError(400, 'no products found'))
  }
}
