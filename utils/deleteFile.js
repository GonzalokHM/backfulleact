import { v2 as cloudinary } from 'cloudinary'

const deleteFile = (imgUrl) => {
  const parts = imgUrl.split('/')
  const fileWithExtension = parts.pop()
  const folder = parts.pop()
  const public_id = `${folder}/${fileWithExtension.split('.')[0]}`

  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.error('Error al eliminar la imagen:', error)
    } else {
      console.log('Imagen eliminada:', result)
    }
  })
}

export default deleteFile
