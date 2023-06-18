const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  id: Number,
  icon: String,
  text: String,
  to: String,
});

const socialLinkSchema = new mongoose.Schema({
  id: Number,
  icon: String,
  text: String,
  to: String,
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: String,
    title: String,
    bio: String,
    phone: String,
    email: String,
    avatar: String,
    links: [linkSchema],
    sociallinks: [socialLinkSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
