const { StatusCodes } = require('http-status-codes')
const User = require('../model/userModel')

const readAll = async (req, res) => {
    try {
        let usersList = await User.find({})
        let users = usersList.filter((item) => item.role !== "admin")
        return res.status(StatusCodes.OK).json({length : users.length, users, success : true})
        res.json({msg : 'read all'})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message, success : false})
    }
}

const readSingle = async (req, res) => {
    try {
        let id = req.params.id;
        let single = await User.findById(id)
        if(!single)
            res.status(StatusCodes.CONFLICT).json({msg : 'Requested user info is not found'})
        res.status(StatusCodes.OK).json({user : single, success : true})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message, success : false})
    }
}

const updateUser = async (req, res) => {
    try {
        let id = req.params.id;
        let single = await User.findById(id)
        if(!single)
            res.status(StatusCodes.CONFLICT).json({msg : 'Requested id is not found'})

            // validating role
        if(single.role === "admin")
            return res.status(StatusCodes.FORBIDDEN).json({msg : 'Un-authorized update entry.. denied', success:false})


        if(req.body.password)
            return res.status(StatusCodes.CONFLICT).json({msg : 'password cannot be update.. denied', success:false})

            await User.findByIdAndUpdate({_id : id}, req.body)
        res.status(StatusCodes.ACCEPTED).json({msg : 'user info successfully updated', success:true})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        let id = req.params.id;
        let single = await User.findById(id)
        if(!single)
            res.status(StatusCodes.CONFLICT).json({msg : 'Requested id is not found'})

     
        await User.findByIdAndDelete({_id : id})
        res.status(StatusCodes.OK).json({msg : 'user info successfully deleted', success:true})
    
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message, success:false})
    }
}

module.exports = {readAll, readSingle, updateUser, deleteUser}