const express = require('express');
const app = express();

const port = 8080;

const session = require('express-session');
const MSSQLStore = require('connect-mssql')(session);

const mssql = require('mssql');
let config ={
    user:'test',
    password:'12345',
    server:'localhost',
    database:'testdb',
    port:1433,
    pool:{
        max:10,
        min:0,
        idleTimeout:30000
    }
}