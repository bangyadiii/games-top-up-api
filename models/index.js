"use strict";

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const config = require("../config");
const basename = path.basename(__filename);
const User = require("./user");
const Game = require("./game");

let db = {};

const uri = config.urlDB;

db.url = uri;
db.options = config.db.options;
db.mongoose = mongoose;

// fs.readdirSync(__dirname)
//     .filter((file) => {
//         return (
//             file.indexOf(".") !== 0 &&
//             file !== basename &&
//             file.slice(-3) === ".js"
//         );
//     })
//     .forEach((file) => {
//         //
//         const model = require(path.join(__dirname, file))(mongoose);
//      });
db.User = User(mongoose);
db.Game = Game(mongoose);
module.exports = db;
