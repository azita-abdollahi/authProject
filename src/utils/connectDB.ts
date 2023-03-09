import conf from "config";
import mongoose from "mongoose";
import {config} from "dotenv";
config()

const dbUrl = `mongodb://${process.env.MONGO_USER||conf.get("db.username")}:${process.env.MONGO_PASS||conf.get(
  "db.pass")}@mongodb:27017/${process.env.MONGO_DB||conf.get("db.dbname")}?authSource=admin`;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(dbUrl);
    console.log('database connected successfully...');
  } catch (error) {
    console.log("connection error...!\n");
    console.error(error);
    process.exit(1)
  }
};

export default connectDB;
