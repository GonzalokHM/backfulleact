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

// const filterProducts = async (req, res, next) => {
//   try {
//     const { name, categoriaName } = req.query
//     let query = {}
//     if (name) {
//       query.titulo = { $regex: name, $options: 'i' }
//     }

//     if (categoriaName) {
//       const category = await Category.findOne({
//         nombre: { $regex: categoriaName, $options: 'i' }
//       })
//       if (category) {
//         query.categoria = category._id
//       } else {
//         return res.json([])
//       }
//     }

//     const products = await Product.find(query).populate('categoria')
//     return res.json(products)
//   } catch (error) {
//     return next(setError(400, 'Error al obtener productos'))
//   }
// }

const filterProducts = async (req, res, next) => {
  try {
    const { name, categoriaName } = req.query

    let pipeline = []
    let category = null
    if (name) {
      pipeline.push({
        $search: {
          index: 'default',
          text: {
            query: name,
            path: 'titulo',
            fuzzy: {
              maxEdits: 1,
              prefixLength: 3
            }
          }
        }
      })
    } else {
      pipeline.push({ $match: {} })
    }

    if (categoriaName) {
      const categoryResults = await Category.aggregate([
        {
          $search: {
            index: 'default',
            text: {
              query: categoriaName,
              path: 'nombre'
            }
          }
        },
        {
          $limit: 1
        }
      ])
      if (categoryResults && categoryResults.length > 0) {
        category = categoryResults[0]
        pipeline.push({
          $match: {
            categoria: category._id
          }
        })
      } else {
        return res.json([])
      }
    }

    pipeline.push({
      $project: {
        _id: 1,
        titulo: 1,
        categoria: 1,
        img: 1,
        descripcion: 1,
        puntuacion: 1,
        precio: 1,
        marca: 1
      }
    })

    const products = await Product.aggregate(pipeline)
    return res.json(products)
  } catch (error) {
    return next(setError(400, 'Error al obtener productos'))
  }
}

//

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const vipSearch = async (req, res, next) => {
  try {
    const { name } = req.query
    if (!name)
      return res
        .status(400)
        .json({ message: 'El parámetro "name" es requerido' })

    let pipeline = []
    pipeline.push({
      $search: {
        index: 'default',
        text: {
          query: name,
          path: 'titulo'
        }
      }
    })
    pipeline.push({
      $project: {
        _id: 1,
        titulo: 1,
        categoria: 1,
        img: 1,
        descripcion: 1,
        puntuacion: 1,
        precio: 1,
        marca: 1
      }
    })

    let products = await Product.aggregate(pipeline)

    if (products.length === 0 && req.user.vip) {
      console.log(
        'No se encontraron productos. Iniciando scraping para usuario VIP...'
      )

      const scrapeWithTimeout = async (searchTerm, timeout = 15000) => {
        return Promise.race([
          productScraper(searchTerm),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Timeout del scraping excedido')),
              timeout
            )
          )
        ])
      }
      let scrapedProducts = []
      try {
        scrapedProducts = await scrapeWithTimeout(name)
      } catch (err) {
        console.error('Error durante el scraping:', err)
        return next(setError(500, 'Error en el proceso de scraping'))
      }

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
        await delay(3000)
      }

      products = await Product.aggregate(pipeline)
    }
    const discountRate = req.user.vip ? 0.9 : 1
    const discountedProducts = products.map((product) => {
      const prodObj =
        typeof product.toObject === 'function' ? product.toObject() : product
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
