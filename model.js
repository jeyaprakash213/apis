// model.js
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: String,
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

const Organization = mongoose.model('Organization', organizationSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Organization, User };
