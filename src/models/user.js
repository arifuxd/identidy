const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  icon: String,
  title: String,
  url: String,
});

const socialLinkSchema = new mongoose.Schema({
  icon: String,
  title: String,
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

// Check if the model has already been compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
