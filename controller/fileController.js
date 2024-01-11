const { StatusCodes } = require("http-status-codes")
const FileSchema = require('../model/fileModel')
const User = require('../model/userModel')
const path = require('path')
const fs = require('fs')
const fileType = require('../util/fileExt')
// remove files
const removeTemp = (filePath) => {
    fs.unlinkSync(filePath)
}

// upload - post + data
const uploadFile = async (req, res) => {
    try {
        const { product } = req.files
        const id = req.userId
        // let fileExt = path.extname()
        // check public follow if folder not exists crete it
        const outPath = path.join(__dirname, '../public')
        if(!fs.existsSync(outPath)){
            fs.mkdirSync(outPath, {recursive:true})
        }

        // no files are attached
        if(!req.files)
            return res.status(StatusCodes.NOT_FOUND).json({ msg : `No Files... `})


        let extUser  = await User.findById({ _id : id }).select('-password')

            if(!extUser){
                removeTemp(product.tempFilePath)
                return res.status(StatusCodes.CONFLICT).json({ msg : `requested user id not found `})
            }

            // validate the file ext
            if(product.mimetype === fileType.docx || product.mimetype === fileType.doc || product.mimetype === fileType.jpg || product.mimetype === fileType.mp3 || product.mimetype === fileType.mp4 || product.mimetype === fileType.pdf || product.mimetype === fileType.png || product.mimetype === fileType.ppt || product.mimetype === fileType.pptx || product.mimetype === fileType.svg){
                await product.mv(path.resolve(__dirname, `../public/${product.name}`), async (err) => {
                    if(err){
                        removeTemp(product.tempFilePath)
                        return res.status(StatusCodes.CONFLICT).json({ msg : err })
                    }

                    let fileRes = await FileSchema.create({ user : extUser, info : product })

                    res.status(StatusCodes.ACCEPTED).json({ msg : "File uploaded successfully", file : fileRes })

                })
            } else  {
                removeTemp(product.tempFilePath)
                return res.status(StatusCodes.CONFLICT).json({ msg : `updaload only png and jpg` })
            }   

    } catch (err) {
        removeTemp(product.tempFilePath)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}
// read all - get
const readFile = async (req, res) => {
    try {
        let files = await FileSchema.find({})
        // let filteredFiles = files.filter((item) => item.user._id === req.userId)
        res.status(StatusCodes.OK).json({ length:files.length,files })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}
// read single - get ref
const readSingleFile = async (req, res) => {
    try {
        res.json({ msg : "Read Single file" })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}
//delete - delete + ref
const deleteFile = async (req, res) => {
    try {
        res.json({ msg : "Delete file" })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}

module.exports = {uploadFile, readFile, readSingleFile, deleteFile}