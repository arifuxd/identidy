import mongoose from "mongoose";

const Mongo_URI = process.env.MONGO_URI;

if (!Mongo_URI) {
  throw new Error("Mongo_URI must be defined");
}

const dbConnect = async () => {
  try {
    await mongoose.connect(Mongo_URI);
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
