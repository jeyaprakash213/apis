// crud.js
const { Organization, User } = require('./model');

const createOrganization = async (data) => {
    try {
        const organization = await Organization.create(data);
        return organization;
    } catch (error) {
        throw new Error(`Error creating organization: ${error.message}`);
    }
};

const getOrganizations = async () => {
    try {
        const organizations = await Organization.find();
        return organizations;
    } catch (error) {
        throw new Error(`Error getting organizations: ${error.message}`);
    }
};

const createUser = async (data) => {
    try {
        const user = await User.create(data);
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const getUser = async (userId) => {
    try {
        const user = await User.findOne({
            _id: userId,
            // role: 'admin'
            // $and: [{ organization: loggedInUserId }, { role: 'admin' }],
        });

        return user;
    } catch (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
};

const getUseronly = async (userId) => {
    try {
        const user = await User.findOne({
            _id: userId,
            role: 'user'
            // $and: [{ organization: loggedInUserId }, { role: 'admin' }],
        });
        return user;
    } catch (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
};


const getAllUsers = async (userId) => {
    try {
        const user = await User.find({
            // _id: userId,
            role: 'user'
            // $and: [{ organization: loggedInUserId }, { role: 'admin' }],
        });
        return user;
    } catch (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
};

const updateUser = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

const deleteUser = async (id) => {
    try {
        await User.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};

module.exports = {
    createOrganization,
    getOrganizations,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUseronly
};
