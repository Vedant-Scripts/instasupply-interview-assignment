import express from "express";
import uploadRoute from "./routes/upload.route.js";
import fetchRoute from "./routes/fetch.route.js";

const app = express();

app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/records", fetchRoute);

app.get("/", (req, res) => {
    res.send("API running");
});

export default app;