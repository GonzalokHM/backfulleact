import setError from '../../config/error.js'
import Category from '../models/Category.js'

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    return res.status(200).json(categories)
  } catch (error) {
    return next(setError(400, 'no categories found'))
  }
}

const getCategoryByName = async (req, res, next) => {
  try {
    const { nombre } = req.params // ej: /api/categories/nombre/Electrónica
    const category = await Category.findOne({ nombre: nombre })
    if (!category) return next(setError(404, 'Categoría no encontrada'))
    return res.json(category)
  } catch (error) {
    return next(setError(400, 'Error al obtener la categoría'))
  }
}

export { getCategories, getCategoryByName }
