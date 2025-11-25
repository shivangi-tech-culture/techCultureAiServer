import express from "express"
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors"
import { connectDB } from "./config/db.js"
import { startAutomaticCleanup } from "./utils/cleanupTempFiles.js"
import userRouter  from "./routes/userRoutes.js"
import employeeRouter from "./routes/empoyeeRoutes.js"
import siteSettingRouter from "./routes/siteSetting.js"
import galleryRouter from "./routes/galleryRoutes.js"
import testimonialRouter from "./routes/testimonialRoutes.js";
import contactRouter from "./routes/contactRoutes.js"
import projectRouter from "./routes/projectRoutes.js"
import serviceRouter from "./routes/serviceRoutes.js"
import jobPostRouter from "./routes/jobPostRoutes.js"
import jobApplicationRouter from "./routes/jobApplication.js"
import enquiryRouter from "./routes/enquiryRoutes.js"
import dashboardRouter from "./routes/dashboardRoutes.js"
import sliderRouter from "./routes/sliderRoutes.js"
import customerRouter from "./routes/customerRouter.js"
import technologyRouter from "./routes/technologiesRoutes.js"
import cleanupRouter from "./routes/cleanupRoutes.js"
import faqRouter from "./routes/faqRoutes.js"
import subscriberRouter from "./routes/subscriberRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import messageRouter from "./routes/messageRoutes.js";

const app = express()
const PORT = process.env.PORT || 5000
app.use(
  cors({
    origin: [
      "https://appcenter.techculture.ai",
      "https://techculture.ai",
      "http://appcenter.techculture.ai",
      "http://techculture.ai",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://165.22.217.110:3001",
      "http://165.22.217.110:3000",
      "http://localhost:3002",
      "http://localhost:8000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);
app.set("trust proxy", true);

app.use(express.json())
app.use(express.json({ limit: "100mb" }));

// For URL-encoded payloads
app.use(express.urlencoded({ limit: "100mb", extended: true }));
connectDB()

app.get("/", (req, res) => {
  res.send("Welcome to Tech Culture API")
})

app.use("/auth", authRoutes);
app.use("/api", dashboardRouter) 
app.use("/api/users", userRouter)
app.use("/api/employees", employeeRouter)
app.use("/api/site-settings", siteSettingRouter)
app.use("/api/gallery", galleryRouter)
app.use("/api/testimonials", testimonialRouter)
app.use("/api/contacts", contactRouter)
app.use("/api/projects", projectRouter)
app.use("/api/services", serviceRouter)
app.use("/api/job-posts", jobPostRouter);
app.use("/api/job-applications", jobApplicationRouter)
app.use("/api/enquiries", enquiryRouter);
app.use("/api/sliders", sliderRouter);
app.use("/api/customers", customerRouter);
app.use("/api/technologies", technologyRouter);
app.use("/api/cleanup", cleanupRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/subscriber", subscriberRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  
  // Start automatic cleanup of temporary files
  // Clean files older than 1 hour, run cleanup every 30 minutes
  startAutomaticCleanup(60, 1);
})

