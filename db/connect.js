const mongoose = require('mongoose')

const connectDb = async () => {
    const url = process.env.MODE === 'development' ? process.env.MONGO_DEV : process.env.MONGO_URL
    return mongoose.connect(url)
    .then(res => {
        console.log('mongo connected')
    })
    .catch(err => console.log(err))
}

module.exports = connectDb