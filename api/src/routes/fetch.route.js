import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";
import { prisma } from "../prismaClient.js";

dotenv.config();

const router = express.Router();


const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

router.get("/", async (req, res) => {

    try {

        const cache = await redis.get("records:all");

        if (cache) {

            console.log("Serving from Redis cache");

            return res.json({
                source: "cache",
                data: JSON.parse(cache)
            });

        }

        console.log("Cache miss — querying Postgres");

        const records = await prisma.record.findMany();

        await redis.set("records:all", JSON.stringify(records));

        res.json({
            source: "database",
            data: records
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch records"
        });

    }

});

export default router;