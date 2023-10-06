const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true},
    passwordHash: { type: String, required: true},
    name: String,
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)