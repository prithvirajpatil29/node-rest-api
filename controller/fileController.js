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
                
                // rename the file -> doc-
                let ext = path.extname(product.name)
                let filename = `doc-${Date.now()}${ext}`
                await product.mv(path.resolve(__dirname, `../public/${filename}`), async (err) => {
                    if(err){
                        removeTemp(product.tempFilePath)
                        return res.status(StatusCodes.CONFLICT).json({ msg : err })
                    }

                    let fileRes = await FileSchema.create({userId : extUser._id ,newName : filename, user:extUser,info : product })

                    res.status(StatusCodes.ACCEPTED).json({ msg : "File uploaded successfully", file : fileRes })

                })
            } else  {
                removeTemp(req.files.product.tempFilePath)
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
        let filteredFiles = files.filter((item) => item.user._id === req.userId)
        res.status(StatusCodes.OK).json({ length:files.length,files })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}
// read single - get ref
const readSingleFile = async (req, res) => {
    try {
        let fileId = req.params.id;
        let userId = req.userId
        let extFile = await FileSchema.findById({_id : fileId})
        if(!extFile)
            return res.status(StatusCodes.CONFLICT).json({msg : 'Requested file id not exists'})

        // if file belongs to authorized user or not
        if(userId != extFile.userId)
            return res.status(StatusCodes.UNAUTHORIZED).json({msg : 'Unauthorized file read..'})
        
        res.status(StatusCodes.ACCEPTED).json({ file : extFile})

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}
//delete - delete + ref
const deleteFile = async (req, res) => {
    try {
        let fileId = req.params.id;
        let userId = req.userId
        let extFile = await FileSchema.findById({_id : fileId})

        if(!extFile)
            return res.status(StatusCodes.CONFLICT).json({msg : 'Requested file id not exists'})

        // if file belongs to authorized user or not
        if(userId != extFile.userId)
            return res.status(StatusCodes.UNAUTHORIZED).json({msg : 'Unauthorized file read..'})
        
        // delete physical file from directory
        let filePath = path.resolve(__dirname, `../public/${extFile.newName}`)

        if(fs.existsSync(filePath)){
            // to delete the file
            await fs.unlinkSync(filePath)
            // to remove file info in db collection
            await FileSchema.findByIdAndDelete({_id : extFile._id})

            return res.status(StatusCodes.ACCEPTED).json({msg : 'File  deleted successfully'})
        } else {
            return res.json({msg : 'File not exist'})

        }
        res.json({ msg : "Delete file" })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
    }
}

module.exports = {uploadFile, readFile, readSingleFile, deleteFile}