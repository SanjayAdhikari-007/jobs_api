require('dotenv').config();
require('express-async-errors');


// Extra Security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();


// Connect DB
const connectDB = require('./db/connect'); 
const authenticateUser = require('./middleware/authentication');

// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// If we are behind a reverse proxy i.e deployment to heroku server.
app.set('trust proxy',1);
// 


app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({
  windowMs: 1* 60 * 1000,
  max: 60,
}));


// Swagger Ui
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDocument = yaml.load("./swagger.yaml");

app.get('/',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB connection Succesfull");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
