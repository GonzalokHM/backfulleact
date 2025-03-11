import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  asin: { type: String, unique: true, required: true },
  titulo: { type: String, required: true },
  img: { type: String },
  descripcion: { type: String },
  puntuacion: { type: Number },
  precio: { type: Number },
  marca: { type: String }
})

const Product = mongoose.model('Product', ProductSchema)

export default Product
