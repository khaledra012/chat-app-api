const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 جاري إغلاق السيرفر...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require("./src/app");
const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB)
  .then(() => console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!"))
  .catch((err) => console.log("❌ فشل الاتصال بالداتابيز:", err));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`🚀 السيرفر شغال دلوقتي على بورت ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 جاري الإغلاق المنظم...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
