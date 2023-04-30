const express = require('express');
const passport = require('../middleware/passport');
const apiRouter = express.Router();
const { database, isDatabaseEnabled } = require('../utility/db');
const { routing } = require('../../shared/routing');
const agentRouter = require('./agent');
const adminRouter = require('./admin');
const clienturl = routing.clienturl;
const serverurl = routing.serverurl;

apiRouter.use('/', (req, res, next) => {
    //console.log(req.session);
    next();
});

apiRouter.get("/", (req, res) => {
    res.json({message: "Hello from server api!"});
});

let databaseRequired = (req, res, next) => {
    if (isDatabaseEnabled()) {
        next();
    } else {
        console.log("Database not enabled!");
        res.status(500).send("Database not enabled!");
    }
}

apiRouter.use('/agent', databaseRequired, agentRouter);
apiRouter.use('/admin', databaseRequired, adminRouter);

module.exports = apiRouter;