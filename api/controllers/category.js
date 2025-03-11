import Category from '../models/Category'

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

const createCategory = async (req, res, next) => {
  try {
    const { nombre, icono } = req.body

    const existingCategory = await Category.findOne({ nombre })
    if (existingCategory) return next(setError(400, 'La categoría ya existe'))

    const newCategory = new Category({
      nombre,
      icono
    })
    const savedCategory = await newCategory.save()
    return res.status(201).json(savedCategory)
  } catch (error) {
    return next(setError(400, 'Error al crear la categoría'))
  }
}

export { getCategories, getCategoryByName }
