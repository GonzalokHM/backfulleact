import productScraper from '../scraper/products.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import setError from '../../config/error.js'

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('categoria')
    return res.status(200).json(products)
  } catch (error) {
    return next(setError(400, 'no products found'))
  }
}

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoria')
    if (!product) return next(setError(404, 'Producto no encontrado por ID'))
    return res.json(product)
  } catch (error) {
    return next(setError(400, 'Error al obtener el producto por ID'))
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

const getProductByASIN = async (req, res, next) => {
  try {
    const product = await Product.findOne({ asin: req.params.asin }).populate(
      'categoria'
    )
    if (!product) return next(setError(404, 'Producto no encontrado por ASIN'))
    return res.json(product)
  } catch (error) {
    return next(setError(400, 'Error al obtener el producto por ASIN'))
  }
}

const vipSearch = async (req, res, next) => {
  try {
    const { name } = req.query
    if (!name)
      return res
        .status(400)
        .json({ message: 'El parámetro "name" es requerido' })

    const query = { titulo: { $regex: name, $options: 'i' } }

    let products = await Product.find(query).populate('categoria')
    if (products.length === 0 && req.user.vip) {
      console.log(
        'No se encontraron productos. Iniciando scraping para usuario VIP...'
      )
      const scrapedProducts = await productScraper(name)

      const nuevosProductos = await Promise.all(
        scrapedProducts.map(async (prod) => {
          const category = await Category.findOne({
            nombre: { $regex: prod.categoria, $options: 'i' }
          })
          if (category) {
            return { ...prod, categoria: category._id }
          } else {
            console.warn(
              `Categoría "${prod.categoria}" no encontrada para el producto "${prod.titulo}"`
            )
            return null
          }
        })
      )

      const validProducts = nuevosProductos.filter((prod) => prod !== null)

      if (validProducts.length > 0) {
        try {
          await Product.insertMany(validProducts, { ordered: false })
        } catch (err) {
          console.error(
            'Error insertando productos (posiblemente por duplicados):',
            err
          )
        }
      }

      products = await Product.find(query).populate('categoria')
    }
    const discountRate = req.user.vip ? 0.9 : 1
    const discountedProducts = products.map((product) => {
      const prodObj = product.toObject()
      if (prodObj.precio && typeof prodObj.precio === 'number') {
        prodObj.precio = prodObj.precio * discountRate
      }
      return prodObj
    })

    return res.json(discountedProducts)
  } catch (error) {
    console.error('Error en búsqueda VIP:', error)
    return next(setError(400, 'Error al obtener productos VIP'))
  }
}
export {
  getProducts,
  getProductById,
  filterProducts,
  getUniqueProductPerCategory,
  getTopSellingPerCategory,
  getProductByASIN,
  vipSearch
}
