const express = require("express");
const fs = require("fs");
const path = require("path");

const AuthRoutes = require("./routes/auth");
const ExpneseRoutes = require("./routes/Expense");
const purchaseRoutes = require("./routes/purchase");

const User = require("./models/User");
const ExpenseTable = require("./models/Expense");
const Order = require("./models/orders");
const ForgotPasswordRequest = require("./models/forgotPassword");

const sequelize = require("./utils/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

const { Stream } = require("stream");

const dotenv = require("dotenv");

dotenv.config();

// for writing logs
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flag: "a" }
// );
// { stream: accessLogStream }

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

User.hasMany(ExpenseTable);
ExpenseTable.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);

app.use("/purchase", purchaseRoutes);
app.use("/auth", AuthRoutes);
app.use("/user", ExpneseRoutes);

app.use((req, res, next) => {
  res.send("Welcome to Express");
});

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
