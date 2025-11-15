import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import fileRoute from "./routes/FileRoute.js";
import lectureRoutes from "./routes/LectureRoute.js";

const PORT = process.env.PORT || 5000;

connectDB();

// Routes

app.use("/api/lectures", lectureRoutes);
app.use("/api/files", fileRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
