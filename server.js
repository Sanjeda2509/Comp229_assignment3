//import express from "express";
//var express = require("express");
//var app = express();
import app from "./server/express.js";
import router from "./server/assets-router.js";



import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import contactRouter from "./routes/contact.routes.js";
import qualificationRouter from "./routes/qualification.routes.js";
import projectRouter from "./routes/project.routes.js";
import userRouter from "./routes/user.routes.js";
import User from "./models/user.model.js";


import dotenv from "dotenv";

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactRouter);
app.use("/api/qualifications", qualificationRouter);
app.use("/api/projects", projectRouter);
app.use("/api/users", userRouter);


//const assetsRouter = require("./server/assets-router");
app.use("/src", router);
app.use("/", function (req, res) {
 res.send("Welcome to User application");
});

//module.exports = app;



const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB database connected successfully');

    // Seed hardcoded admin user (run once on server start)
    const ADMIN_EMAIL = 'admin@example.com';
    const ADMIN_PASSWORD = 'Admin123!';
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await new User({ name: 'Admin', email: ADMIN_EMAIL, password: hashed, role: 'admin' }).save();
      console.log('Admin user seeded:', ADMIN_EMAIL);
    }

    app.listen(PORT, () => console.log(`App running in port ${PORT}`));
  })
  .catch(err => console.log('MongoDB connection failed:', err.message));


export default app;

