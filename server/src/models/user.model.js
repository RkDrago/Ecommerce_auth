import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
)

userSchema.index({ refreshToken: 1 })

const UserModel = mongoose.model('User', userSchema)

export default UserModel
