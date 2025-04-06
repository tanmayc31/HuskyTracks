import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email.endsWith("@northeastern.edu")) {
    return res.status(400).json({ message: "Only Northeastern emails allowed." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
        message: "Login successful",
        user: {
          email: user.email,
          role: user.role,
        },
      });
      
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
