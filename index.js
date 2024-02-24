// index.js
const express = require('express');
const connectDB = require('./db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = express();
const PORT = process.env.PORT || 3000;

const { createOrganization, getOrganizations, createUser, getUser, getAllUsers, updateUser, deleteUser, getUseronly } = require('./Crud');
const { Organization, User } = require('./model');

// Passport configuration
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username, password: password }, async (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect username.' });
            return done(null, user);
            // if (user.role == "admin") {
            //     const organizations = await Organization.findOne({ _id: user.organization });
            //     user.organization = await organizations.name
            //     return done(null, user);

            // } else {
            //     return done(null, user.name);
            // }



        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    require('express-session')({
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Middleware to check if user is authenticated
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden. Admin access required.' });
};

const isUserOrAdmin = (req, res, next) => {
    if ((req.body.role === 'admin' || req.body.id)) {
        return next();
    }
    res.status(403).json({ message: 'Forbidden. User or Admin access required.' });
};

// API endpoints
app.post('/login', passport.authenticate('local'), async (req, res) => {
    console.log("ressssssssssssss", res)
    res.json({ message: 'Login successful' });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful' });
});

app.post('/organizations', async (req, res) => {
    try {
        const organization = await createOrganization(req.body);
        res.json(organization);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getOrganizations();
        res.json(organizations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        if (req.body.username) {
            const user = await User.findOne({ username: req.body.username });
            if (user && req.body.username == user.username) {
                res.json({ "massese": "User already exists" })
            } else {
                const user = await createUser(req.body);
                res.json(user);
            }
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const user = await getUser(req.body.id);

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/adminoruser', isUserOrAdmin, async (req, res) => {
    try {
        if (req.body.role == 'admin') {
            // Admin can view all data
            const organizations = await getOrganizations();
            const users = await getAllUsers();
            res.json({ organizations, users });
        } else {
            // Regular user can only view their own info
            const user = await getUseronly(req.body.id);
            if (user) {
                res.json({ user });
            } else {
                res.json({ "massese": "User data only fetch" })
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/usersUpdate', async (req, res) => {
    try {
        const user = await updateUser(req.body.id, req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/deleteuser', async (req, res) => {
    try {
        await deleteUser(req.body.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
