import dotenv from "dotenv";
import app from "./app.js";
import { prisma } from "./prismaClient.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  const result = await prisma.record.findMany();
  console.log("DB connected:", result);
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});