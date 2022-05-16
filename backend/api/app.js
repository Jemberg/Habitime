require("../config/database");

const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const categoryRouter = require("./routes/category");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);
app.use(categoryRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
