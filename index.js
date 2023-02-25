const express = require("express");

const { connection } = require("./configs/db");
const { userRouter } = require("./routes/User.routes");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/", userRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to Database");
  } catch (err) {
    console.log(err);
  }

  console.log(`Server running at Port : ${process.env.port}`);
});
