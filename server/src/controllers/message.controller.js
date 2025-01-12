import asyncHandler from "express-async-handler";
import Message from "../models/message.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  const newMessage = new Message({
    name,
    email,
    subject,
    message,
  });

  try {
    const savedMessage = await newMessage.save();
    if (savedMessage) {
      res.status(201).json({ message: "Message sended successfully" });
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save message", error: error.message });
  }
});

export { sendMessage };
