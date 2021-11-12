const createError = require("http-errors");
const express = require("express");
// const socketIo = require("socket.io")
// const authMiddleware = require("./middlewares/auth");
const morgan = require("morgan");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const path = require("path");


const cors = require("cors");
const corsOptions = {
  origin: "*",
  // methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  // preflightContinue: false,
  credentials: true,
  // optionsSuccessStatus: 204,
};

//parser
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
require("dotenv").config();
app.use(morgan('dev'));


// app.use(compression());
// app.set('views', path.join(__dirname, 'views'));

const dogsRouter = require("./routes/dog");
const detailRouter = require("./routes/detail");
const infoRouter = require("./routes/userInfo");
const usersRouter = require("./routes/user");
const dogstaRouter = require("./routes/dogsta");
const pagesRouter = require("./routes/mypage");

app.use("/dogs", dogsRouter);
app.use("/posts", detailRouter);
app.use("/users", infoRouter);
app.use("/users", usersRouter);
app.use("/dogsta", dogstaRouter);
app.use("/mypage", pagesRouter);

app.get("/", (_, res) => res.render("home"));

// const auth = require("./middlewares/auth");

//swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
