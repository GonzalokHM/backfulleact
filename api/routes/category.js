import express from 'express'
import { getCategories, getCategoryByName } from '../controllers/category.js'

const categoriesRoutes = express.Router()

categoriesRoutes.get('/', getCategories)
categoriesRoutes.get('/nombre/:nombre', getCategoryByName)

export default categoriesRoutes
