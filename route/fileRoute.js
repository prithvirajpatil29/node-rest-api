const fileRoute = require("express").Router()
const { uploadFile, readFile, readSingleFile, deleteFile, allFiles, filterType } = require("../controller/fileController")
const auth = require('../middleware/auth')

fileRoute.post('/upload', auth, uploadFile)

fileRoute.get('/all', auth, readFile)

fileRoute.get('/single/:id', auth, readSingleFile)

fileRoute.delete('/delete/:id', auth, deleteFile)

fileRoute.get('/open',allFiles )
fileRoute.get('/filter', filterType)
module.exports = fileRoute