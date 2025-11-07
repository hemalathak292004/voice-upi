const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { readDB, writeDB } = require("./lib/db");
const Razorpay = require("razorpay");

const app = express();
// CORS configuration - allow both localhost and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://voice-upi-yggc.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins for now, or restrict as needed
      }
    },
    credentials: false,
  })
);
app.use(bodyParser.json());

// Removed OTP functionality - direct UPI validation only
// Razorpay instance (if keys available)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (e) {
    console.error("Failed to initialize Razorpay:", e.message);
  }
}

// Initialize DB if missing keys
function ensureDB() {
  const db = readDB();
  db.balance = typeof db.balance === "number" ? db.balance : 5000;
  db.contacts = Array.isArray(db.contacts)
    ? db.contacts
    : [
        { name: "Ramesh", mobile: "9999999999", upi: "ramesh@upi" },
        { name: "Sita", mobile: "8888888888", upi: "sita@upi" },
      ];
  db.transactions = Array.isArray(db.transactions) ? db.transactions : [];
  db.users = Array.isArray(db.users) ? db.users : [];
  writeDB(db);
  return db;
}

// Contact UPI Validation API with Real Validation
app.post("/api/validateContactUPI", (req, res) => {
  const { name, mobile, upi } = req.body || {};

  if (!name || !mobile || !upi) {
    return res
      .status(400)
      .json({ error: "Name, mobile, and UPI ID are required" });
  }

  // Validate UPI format
  const upiPattern = /^[\w\-.]+@[\w]+$/;
  if (!upiPattern.test(upi)) {
    return res
      .status(400)
      .json({ error: "Invalid UPI ID format. Use format: name@upi" });
  }

  // Validate mobile number
  if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  // Extract name from UPI ID (part before @)
  const upiName = upi
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const contactName = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Simulate API call delay
  setTimeout(() => {
    // Validation logic: Check if UPI ID matches the contact's name
    // Real implementation would call UPI validation service
    const validationRule1 =
      upiName.includes(contactName) || contactName.includes(upiName);
    const validationRule2 = upiName.length >= 3 && contactName.length >= 3;

    // Additional check: UPI ID should be reasonably related to the name
    // For example: "john@paytm" should match "John Doe"
    const matches = validationRule1 && validationRule2;

    if (!matches) {
      return res.status(400).json({
        error:
          "UPI ID does not match the provided name and phone number. Please verify that the UPI ID belongs to this contact.",
        details: {
          providedUpiName: upiName,
          contactName: contactName,
          upi,
          name,
          mobile,
        },
      });
    }

    // If all validations pass
    res.json({
      success: true,
      message: "UPI ID validated successfully",
      isValid: true,
      details: {
        name,
        mobile,
        upi,
      },
    });
  }, 1500); // Simulate API call delay
});

// Simplified UPI Validation API - No OTP required
app.post("/api/validateUPI", (req, res) => {
  const { upi, mobile, name } = req.body || {};

  if (!upi || !mobile || !name) {
    return res
      .status(400)
      .json({ error: "UPI ID, mobile number, and name are required" });
  }

  // Validate UPI format
  const upiPattern = /^[\w\-\.]+@[\w]+$/;
  if (!upiPattern.test(upi)) {
    return res
      .status(400)
      .json({ error: "Invalid UPI ID format. Use format: name@upi" });
  }

  // Validate mobile number
  if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  // Simulate UPI validation (in production, call real UPI validation service)
  // For demo purposes, we'll accept any valid format
  setTimeout(() => {
    // Create/update user profile directly
    const db = ensureDB();

    // Check if user already exists
    const existingUser = db.users.find((u) => u.upi === upi);

    if (existingUser) {
      // Update existing user
      existingUser.name = name;
      existingUser.mobile = mobile;
      existingUser.lastLogin = Date.now();
      existingUser.isVerified = true;
    } else {
      // Create new user
      const newUser = {
        name,
        mobile,
        upi,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        isVerified: true,
      };
      db.users.push(newUser);
    }

    writeDB(db);

    res.json({
      success: true,
      message: "UPI ID validated successfully",
      user: {
        name,
        mobile,
        upi,
        isVerified: true,
      },
    });
  }, 1000); // Simulate API call delay
});

app.get("/api/getBalance", (req, res) => {
  const db = ensureDB();
  res.json({ balance: db.balance });
});

app.get("/api/getTransactions", (req, res) => {
  const db = ensureDB();
  // Return latest first
  const tx = [...db.transactions].sort((a, b) => b.date - a.date);
  res.json({ transactions: tx });
});

app.get("/api/getContacts", (req, res) => {
  const db = ensureDB();
  res.json({ contacts: db.contacts });
});

app.post("/api/sendMoney", (req, res) => {
  const { amount, receiverName } = req.body || {};
  const amt = Number(amount);
  if (!amt || amt <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  const db = ensureDB();
  const contact = db.contacts.find(
    (c) => c.name.toLowerCase() === String(receiverName || "").toLowerCase()
  );
  if (!contact) {
    return res.status(404).json({ error: "Receiver not found in contacts" });
  }
  if (db.balance < amt) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  db.balance -= amt;
  const tx = {
    id: Date.now(),
    sender: "You",
    receiver: contact.name,
    amount: amt,
    date: Date.now(),
  };
  db.transactions.push(tx);
  writeDB(db);
  res.json({ success: true, balance: db.balance, transaction: tx });
});

app.post("/api/addContact", (req, res) => {
  const { name, mobile, upi } = req.body || {};
  if (!name || !mobile || !upi) {
    return res
      .status(400)
      .json({ error: "Name, mobile, and UPI are required" });
  }
  const db = ensureDB();
  const exists = db.contacts.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ error: "Contact already exists" });
  }
  const newContact = { name, mobile, upi };
  db.contacts.push(newContact);
  writeDB(db);
  res.json({ success: true, contact: newContact });
});

app.delete("/api/deleteContact/:name", (req, res) => {
  const { name } = req.params;
  const db = ensureDB();
  const idx = db.contacts.findIndex(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (idx === -1) {
    return res.status(404).json({ error: "Contact not found" });
  }
  db.contacts.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// Razorpay: Create order
app.post("/api/createOrder", async (req, res) => {
  try {
    if (!razorpay) {
      return res
        .status(500)
        .json({ error: "Razorpay not configured on server" });
    }
    const {
      amount,
      currency = "INR",
      receipt = `rcpt_${Date.now()}`,
    } = req.body || {};
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const options = {
      amount: Math.round(amt * 100),
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (e) {
    console.error("createOrder failed:", e);
    res.status(500).json({ error: "Failed to create order" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  ensureDB();
  console.log(`Server listening on http://localhost:${PORT}`);
});
