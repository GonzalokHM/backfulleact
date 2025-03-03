import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  img: { type: String },
  descripcion: { type: String },
  puntuacion: { type: Number },
  precio: { type: Number },
  ASIN: { type: String, unique: true },
  categoria: { type: String }
})

const Product = mongoose.model('Product', ProductSchema)

export default Product
