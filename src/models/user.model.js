const mongooese = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = new mongooese.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid Email..')
                }
            }
        },
        contact: {
            type: String,
            required:true,
            validate(v) {
                if (v.minlength == 10) throw new Error('contact must be a 10 digits')
            }
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        verificationStatus: {
            type: String,
            trim: true,
            default: true
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: 7,
            validate(v) {
                if (v.toLowerCase().includes("password")) throw new Error("can't give 'password' in password")
            }
        }
    },
    {
        timestamps:true
    }
)

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}   


// create findByCredentials method in User schema
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })// verificationStatus:"pending"
    if (!user)
        throw new Error("Invalid email or password")

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error("Invalid email or password")
    return user
}

//create method for generating auth token for user login
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, 'thisismysecretforkwttoken')
    return token
}

//Hash plain password using bcrypt and save in DB
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    if (user.role == "manager") {
        user.verificationStatus = "pending";
        
    }
    else
        user.verificationStatus = "true"
    next();
})


const User = mongooese.model('User', userSchema)    

module.exports = User