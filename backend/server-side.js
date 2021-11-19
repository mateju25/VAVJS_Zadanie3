// Matej Delincak

const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const mysql = require('mysql');
const bodyParser = require('body-parser');

let router = express.Router();


const oneDay = 1000 * 60 * 60 * 24;
let app = express();
app.use(sessions({
    secret: "secretKey",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

module.exports = app;
