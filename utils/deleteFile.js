import cloudinary from ('cloudinary').v2

const deleteFile = (imgUrl) => {

    const imgSplited = imgUrl.split('/')
    const nameSplited = imgSplited.at(-1).split('.')
    nameSplited[0]
    const folderSplited = imgSplited.at(-2)
    const public_id = `${folderSplited}/${nameSplited[0]}`

    cloudinary.uploader.destroy(public_id, () => {
        console.log('imagen eliminada')
    })

}

export default  deleteFile