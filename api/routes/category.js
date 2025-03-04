import express from 'express'
import {
  getCategories,
  getCategoryByNumber,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category'

const categoriesRoutes = express.Router()

categoriesRoutes.get('/', getCategories)
categoriesRoutes.get('/numero/:code', getCategoryByNumber)
categoriesRoutes.get('/nombre/:nombre', getCategoryByName)
categoriesRoutes.post('/', createCategory)
categoriesRoutes.put('/:id', updateCategory)
categoriesRoutes.delete('/:id', deleteCategory)

export default categoriesRoutes
