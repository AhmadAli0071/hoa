import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/db/index.js";
import bodyParser from "body-parser";
import messageRoutes from "./src/routes/message.routes.js";
import express from "express";
const app = express();
dotenv.config();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use("/api/v1/message", messageRoutes);

// db connection and server listening
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port:${process.env.PORT} !!`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
