
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB Connected");
    console.log("Database Name:", conn.connection.name);
    console.log(
      "MongoDB Host:",
      conn.connection.host
    );

    const collections =
      await conn.connection.db
        .listCollections()
        .toArray();

    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    const courseCount =
      await mongoose.connection.db
        .collection("courses")
        .countDocuments();

    console.log(
      "COURSE COUNT:",
      courseCount
    );

    console.log("=================================");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;