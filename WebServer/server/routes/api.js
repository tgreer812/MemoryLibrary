const express = require('express');
const passport = require('../middleware/passport');
const apiRouter = express.Router();
const { database, databaseEnabled } = require('../utility/db');
const { routing } = require('../../shared/routing');

const clienturl = routing.clienturl;
const serverurl = routing.serverurl;

apiRouter.use('/', (req, res, next) => {
    console.log(req.session);
    next();
});

apiRouter.get("/", (req, res) => {
    res.json({message: "Hello from server api!"});
});

let databaseRequired = (req, res, next) => {
    if (databaseEnabled) {
        next();
    } else {
        console.log("Database not enabled!");
        res.status(500).send("Database not enabled!");
    }
}

apiRouter.post("/register", databaseRequired, async (req, res, next) => {
    console.log("Hit register endpoint");
    let data = req.body;
    console.log(JSON.stringify(data));

    const newUser = await database.createUser(data);
    if (newUser) {
        console.log("Added user successfully!");
        database.printDatabase();
        return res.status(201).json({
            msg: "User created successfully!",
            newUser
        });
    }
    console.log("Failed to add user!");
    return res.status(400).send(JSON.stringify(
        {
            "error": "Malformed data",
            "fields": [
                "username",
                "password"
            ]
        },
        null,
        2
    ));
})

apiRouter.post('/login', databaseRequired, passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    console.log(`Redirecting client -> ${clienturl}`);
    res.redirect(`${clienturl}/`);
});

apiRouter.delete('/logout', databaseRequired, (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ msg: "Server Error" });
      res.clearCookie("connect.sid", {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7*24*60*60*1000,
      });
      res.status(204).end();
    });
  });

apiRouter.get('/validateSession', databaseRequired, (req, res) => {
    console.log("Hit /validateSession endpoint!");
    console.log(`is Authenticated: ${req.isAuthenticated()}`);
    return res.json({
        isValid: (req.isAuthenticated() ? true : false),
        username: (req.isAuthenticated() ? req.session.passport.user : ''),
    })
  });

// Middleware to check if user is logged in
let authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(`User ${req.session.passport.user} is logged in`);
        next();
    } else {
        console.log('User is not logged in');
        res.status(401).send('Unauthorized');
    }
}

module.exports = apiRouter;