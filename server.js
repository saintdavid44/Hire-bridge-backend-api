import app from "./app.js";

const PORT = process.env.PORT || 3000;

const dbUrl = process.env.DATABASE_URL;

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Failed to connect to DB...", error);
    process.exit(1);
  }
};

startServer();

