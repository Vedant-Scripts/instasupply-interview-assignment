import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import { prisma } from "../prismaClient.js";
import { sendEvent } from "../kafkaProducer.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {

  const results = [];

  try {

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {

        for (const row of results) {

          try {

            await prisma.record.create({
              data: {
                name: row.name,
                email: row.email
              }
            });

          } catch (err) {

            if (err.code !== "P2002") {
              throw err;
            }

          }

        }

        await sendEvent({
          event: "records_uploaded",
          records: results
        });

        res.json({
          status: "success",
          rowsProcessed: results.length
        });

      });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});

export default router;