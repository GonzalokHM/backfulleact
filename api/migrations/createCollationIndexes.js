import dotenv from 'dotenv'
import Category from '../models/Category.js'
import connectDB from '../../config/db.js'

dotenv.config()

const createIndexes = async () => {
  try {
    await connectDB()
    console.log('Conectado a MongoDB')

    await Category.collection.createIndex(
      { nombre: 'text' },
      { default_language: 'spanish', collation: { locale: 'es', strength: 1 } }
    )
    console.log('Índice de collation creado en Category')

    process.exit(0)
  } catch (error) {
    console.error('Error creando índices:', error)
    process.exit(1)
  }
}

createIndexes()
