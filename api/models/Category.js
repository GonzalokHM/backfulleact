import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  slug: { type: String, required: true },
  icono: { type: String }
})

const Category = mongoose.model('Category', CategorySchema)

export default Category
