import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { app as graphApp } from "./graph.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/process", async (req, res) => {
  try {
    const { messages } = req.body;
    const result = await graphApp.invoke({ messages });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
