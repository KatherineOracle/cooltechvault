// The main application script, ties everything together.
const PORT = process.env.PORT || 5000;
const path = require('path')
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const helmet = require("helmet");
const app = express();
const verifyToken = require('./middleware/verifyToken');
const verifyRole = require('./middleware/verifyRole');

//for security
app.use(helmet());
app.use(cors());

require('dotenv').config();

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}


//middleware for cookies
app.use(cookieParser());
//helper for json
app.use(express.json());

/**HIGH LEVEL ROUTES **/
//Routes that do not require a token

app.use("/api", require('./routes/root'));
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//routes after this point will use the verifyToken middleware
app.use(verifyToken);
app.use('/api/profile', require('./routes/profile'));

//need to verify role as employee or higher
app.use('/api/credentials', verifyRole('employee'), require('./routes/credentials'));
app.use('/api/credential', verifyRole('employee'), require('./routes/credential'));

app.use(verifyRole('administrator'));
app.use('/api/user', require('./routes/user'));
app.use('/api/users', require('./routes/users'));
app.use('/api/divisions', require('./routes/divisions'));

// connect to Mongo when the app initializes
const uri = process.env.CONNECTIONSTRING;
mongoose.connect(uri).catch((error) => handleError(error));

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const handleError = (error)  => {
  console.log("DB error:"+error);
}

app.listen(PORT, () => {
  console.log(`CooltechVault API listening on port ${PORT}`);
});
