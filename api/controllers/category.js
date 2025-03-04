import Category from '../models/Category'

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    return res.status(200).json(categories)
  } catch (error) {
    return next(setError(400, 'no categories found'))
  }
}

const getCategoryByNumber = async (req, res, next) => {
  try {
    const { code } = req.params // ej: /api/categories/numero/1
    const category = await Category.findOne({ code: code })
    if (!category) return next(setError(404, 'Categoría no encontrada'))
    return res.json(category)
  } catch (error) {
    return next(setError(400, 'Error al obtener la categoría'))
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
    const { nombre, slug, icono } = req.body

    const existingCategory = await Category.findOne({ nombre })
    if (existingCategory) return next(setError(400, 'La categoría ya existe'))

    const lastCategory = await Category.findOne({}).sort({ code: -1 })
    let nextCategoryNumber = '1'
    if (lastCategory && lastCategory.code) {
      nextCategoryNumber = (parseInt(lastCategory.code) + 1).toString()
    }

    const newCategory = new Category({
      code: nextCategoryNumber,
      nombre,
      slug,
      icono
    })
    const savedCategory = await newCategory.save()
    return res.status(201).json(savedCategory)
  } catch (error) {
    return next(setError(400, 'Error al crear la categoría'))
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, slug, icono } = req.body
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { nombre, slug, icono },
      { new: true }
    )
    if (!updatedCategory) return next(setError(404, 'Categoría no encontrada'))
    return res.json(updatedCategory)
  } catch (error) {
    return next(setError(400, 'Error al actualizar la categoría'))
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedCategory = await Category.findByIdAndDelete(id)
    if (!deletedCategory) return next(setError(404, 'Categoría no encontrada'))
    return res.json({ message: 'Categoría eliminada' })
  } catch (error) {
    return next(setError(400, 'Error al eliminar la categoría'))
  }
}

export {
  getCategories,
  getCategoryByNumber,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory
}
