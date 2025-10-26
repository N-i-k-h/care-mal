const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a normal user
exports.registerUser = async (req, res) => {
  try {
    console.log("📥 Registering User:", req.body);

    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const user = new User({ name, email, password, phoneNumber });
    await user.save();

    console.log("✅ User registered:", user._id);
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("❌ User Registration Error:", error);
    res.status(500).send("Server Error: " + error.message);
  }
};

// Register a doctor
exports.registerDoctor = async (req, res) => {
  try {
    console.log("📥 Registering Doctor:", req.body);

    const { name, email, password, phoneNumber, specialization, licenseNumber } = req.body;
    if (!name || !email || !password || !phoneNumber || !specialization || !licenseNumber) {
      return res.status(400).send("All fields are required");
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).send("Doctor already exists");

    const doctor = new Doctor({ name, email, password, phoneNumber, specialization, licenseNumber });
    await doctor.save();

    console.log("✅ Doctor registered:", doctor._id);
    res.status(201).send("Doctor registered successfully");
  } catch (error) {
    console.error("❌ Doctor Registration Error:", error);
    res.status(500).send("Server Error: " + error.message);
  }
};

// Login (for both users and doctors)
exports.login = async (req, res) => {
  try {
    const { email, password, isDoctor } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const Model = isDoctor ? Doctor : User;
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isDoctor },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        ...(isDoctor && {
          specialization: user.specialization,
          licenseNumber: user.licenseNumber
        }),
        isDoctor
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};