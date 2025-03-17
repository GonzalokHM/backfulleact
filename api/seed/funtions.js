import fs from 'fs'
import csv from 'csv-parser'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cleanCollections = async () => {
  try {
    await Product.collection.drop()
    console.log('>>> Colecciones limpias')
  } catch (error) {
    // no existe code = 26
    if (error.code === 26) {
      console.log('>>> Colección no existe, omitiendo limpieza')
    } else {
      console.error('Error limpiando colecciones: ', error)
      throw error
    }
  }
  try {
    await Category.collection.drop()
    console.log('>>> Colección de categorías limpia')
  } catch (error) {
    if (error.code === 26) {
      console.log('>>> Colección de categorías no existe, omitiendo limpieza')
    } else {
      console.error('Error limpiando la colección de categorías:', error)
      throw error
    }
  }
}

const saveCategoryDocuments = async () => {
  const results = []
  const csvFilePath = path.join(__dirname, 'data', 'Categorias.csv')

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await Category.insertMany(results)
          console.log('>>> Documentos de categorías guardados')
          resolve()
        } catch (error) {
          console.error('Error guardando documentos de categorías:', error)
          reject(error)
        }
      })
      .on('error', (err) => {
        console.error('Error en el stream de categorías:', err)
        reject(err)
      })
  })
}

const saveProductDocuments = async () => {
  const results = []
  const csvFilePath = path.join(__dirname, 'data', 'Productos.csv')

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const productsWithCategoryRef = await Promise.all(
            results.map(async (product) => {
              const category = await Category.findOne({
                nombre: product.categoria
              })
              if (category) {
                return { ...product, categoria: category._id }
              } else {
                console.warn(
                  `Categoría "${product.categoria}" no encontrada para el producto "${product.asin}"`
                )
                return null
              }
            })
          )
          const validProducts = productsWithCategoryRef.filter(
            (prod) => prod !== null
          )

          await Product.insertMany(validProducts)
          console.log('>>> Documentos productos guardados')
          resolve()
        } catch (error) {
          console.error('Error guardando documentos de productos: ', error)
          reject(error)
        }
      })
      .on('error', (err) => {
        console.error('Error en el stream: ', err)
        reject(err)
      })
  })
}

export { cleanCollections, saveProductDocuments, saveCategoryDocuments }
