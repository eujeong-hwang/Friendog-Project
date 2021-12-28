const createError = require('http-errors');
const express = require('express');
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const path = require('path');

// cors 
const cors = require('cors');
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

// views
app.set('views', path.join(__dirname, 'views'));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
require('dotenv').config();

const dogsRouter = require("./routes/dog");
const detailRouter = require("./routes/detail");
const infoRouter = require("./routes/userInfo");
const usersRouter = require("./routes/user");
const dogstaRouter = require("./routes/dogsta");
const dogstaFilterRouter = require("./routes/dogstaFilter");
const pagesRouter = require("./routes/mypage");
const chatRouter = require("./routes/chat");
const likeRouter = require("./routes/dogstaLike");
const notificationRouter = require("./routes/notification");
const commentRouter = require("./routes/comment");

app.use("/dogs", dogsRouter); 
app.use("/posts", detailRouter); 
app.use("/users", infoRouter); 
app.use("/users", usersRouter); 
app.use("/dogsta", dogstaRouter); 
app.use("/dogstaFilter", dogstaFilterRouter); 
app.use("/mypage", pagesRouter); 
app.use("/chat", chatRouter); 
app.use("/likes", likeRouter); 
app.use("/notification", notificationRouter); 
app.use("/comment", commentRouter); 

//swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// // catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ 
    message: err.message,
    error: err
  });
});

module.exports = app;
