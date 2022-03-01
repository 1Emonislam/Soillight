const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
    role: {
        type: String,
        lowercase: true,
        required: [true, 'Please Select your Role!']
    },
    status: {
        type: String,
        default: 'pending'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: [true, 'Please fillup the Name!']
    },
    phone: {
        type: String,
        required: [true, "please fillup the Number!"]
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: [true, 'Please fillup the Email!'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please fillup the Password!']
    },
    valid_id: {
        verify_id: {
            type: Boolean,
        },
        back_side_id: {
            type: String,
        },
        front_side_id: {
            type: String,
        }
    },
    license_card: {
        verify_card: {
            type: Boolean,
        },
        back_side_card: {
            type: String,
        },
        front_side_card: {
            type: String,
        }
    },
    my_balance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MyBalance'
    },
    address: {
        type: String,
    },
    pic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    sellerShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    adminShop: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }],
}, {
    timestamps: true,
})
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userSchema);
module.exports = User;