const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {config} = require('./config/index');
const app = express();

// routes
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
// error middlewares
const notFoundHanlder = require('./utils/middleware/notFoundHandler');
const {
	logErrors,
	wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers');

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
app.use('/posts', postsRouter);
app.use('/users', usersRouter);




// 404 not found
app.use(notFoundHanlder);

// error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

// port
app.listen(config.port, function() {
  console.log(`listening http://localhost:${config.port}`);
});