const fileRoute = require('express').Router()

const {uploadFile, readAll, readSingle, deleteFile} = require('../controller/fileController')
const auth = require('../middleware/auth')
fileRoute.post('/upload', uploadFile)

fileRoute.get('/all',auth, readAll)
fileRoute.get('/single/:id',auth, readSingle)

fileRoute.delete('/delete/:id',auth,deleteFile)

module.exports = fileRoute