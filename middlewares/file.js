import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'backfulleact',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
})

const upload = multer({ storage })

export default upload
