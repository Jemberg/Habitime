require("../config/database");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");

const taskRouter = require("./routes/task");
const periodicalRouter = require("./routes/periodical");
const habitRouter = require("./routes/habit");

const notificationRouter = require("./routes/notification");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(helmet());

app.use(userRouter);
app.use(categoryRouter);

app.use(taskRouter);
app.use(periodicalRouter);
app.use(habitRouter);

app.use(notificationRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
