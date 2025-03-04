import Category from '../models/Category'
import Product from '../models/Product'

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('categoria')
    return res.status(200).json(products)
  } catch (error) {
    return next(setError(400, 'no products found'))
  }
}

const filterProducts = async (req, res, next) => {
  try {
    const { name, categoriaName } = req.query
    let query = {}
    if (name) {
      query.titulo = { $regex: name, $options: 'i' }
    }

    if (categoriaName) {
      const category = await Category.findOne({
        nombre: { $regex: categoriaName, $options: 'i' }
      })
      if (category) {
        query.categoria = category._id
      } else {
        return res.json([])
      }
    }

    const products = await Product.find(query).populate('categoria')
    return res.json(products)
  } catch (error) {
    return next(setError(400, 'Error al obtener productos'))
  }
}

const getUniqueProductPerCategory = async (req, res, next) => {
  try {
    const uniqueProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoriaData'
        }
      },
      { $unwind: '$categoriaData' },
      { $sort: { titulo: 1 } },
      {
        $group: {
          _id: '$categoria',
          producto: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$producto' } }
    ])
    return res.json(uniqueProducts)
  } catch (error) {
    return next(
      setError(400, 'Error al obtener productos únicos por categoría')
    )
  }
}

const getTopSellingPerCategory = async (req, res, next) => {
  try {
    const topProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoriaData'
        }
      },
      { $unwind: '$categoriaData' },
      { $sort: { puntuacion: -1 } },
      {
        $group: {
          _id: '$categoria',
          producto: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$producto' } }
    ])
    return res.json(topProducts)
  } catch (error) {
    return next(setError(400, 'Error al obtener top ventas por categoría'))
  }
}

// Se asume que el parámetro "asin" se pasa en la URL, por ejemplo: /api/products/asin/B0012345
export const getProductByASIN = async (req, res, next) => {
  try {
    const product = await Product.findOne({ ASIN: req.params.asin }).populate(
      'categoria'
    )
    if (!product) return next(setError(404, 'Producto no encontrado por ASIN'))
    return res.json(product)
  } catch (error) {
    return next(setError(400, 'Error al obtener el producto por ASIN'))
  }
}

export {
  getProducts,
  filterProducts,
  getUniqueProductPerCategory,
  getTopSellingPerCategory,
  getProductByASIN
}
