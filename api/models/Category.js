import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  icono: { type: String, required: true }
})

const Category = mongoose.model('Category', CategorySchema)

export default Category
