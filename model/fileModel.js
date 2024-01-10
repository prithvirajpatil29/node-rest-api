const mongoose = require('mongoose')
const fileSchema = new mongoose.Schema({
    user : {
        type:Object,
        required : true,
        // trim : true
    },
    info : {
        type : Object,
        required : true
    },
    isActive : {
        type:Boolean,
        default:true
    }
},{
    collation:'files',
    timestamps:true
})

module.exports = mongoose.model('FileSchema', fileSchema)