import cloudinary from '../config/cloudinary'

const uploadToCloudinary = async (filePath, folder = 'backfulleact') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder })
    return result
  } catch (error) {
    throw new Error('Error uploading to Cloudinary')
  }
}

export default uploadToCloudinary
