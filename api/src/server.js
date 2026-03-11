import express from "express";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.route.js";
import fetchRoute from "./routes/fetch.route.js";
import { prisma } from "./prismaClient.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/records", fetchRoute);

app.get("/", (req, res) => {
  res.send("API running");
});

(async () => {
  const result = await prisma.record.findMany();
  console.log("DB connected:", result);
})()


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});