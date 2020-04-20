const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {config} = require('./config/index');
const app = express();

// mongodb connection
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const mongoUri = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;
mongoose.connect(mongoUri,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', function(){
  console.log('Connected to mongodb sucessfuly');
});
connection.on('error', function(){
  console.error("Something went wrong with the connection of the db");
})
// middlewares
app.use(express.json());
app.use(cors());

// routes 
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// port
app.listen(config.port, function() {
  console.log(`listening http://localhost:${config.port}`);
});