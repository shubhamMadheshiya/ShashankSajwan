require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const corsOptions = require("./src/config/corsOptions");
const passportConfig = require("./src/config/passport");
const keys = require("./src/config/keys");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");


const app = express();

const PORT = keys.port;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

app.use(morgan("tiny"));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Initialize Passport
passportConfig.initializePassport(app);

// Routes
app.use("/", require("./src/routes/root"));
app.use("/news", require("./src/routes/news"))





// Start server after MongoDB connection is established
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
