import ErrorHandler from "./middlewares/ErrorHandler";
import orderRoutes from "./routes/order.routes";
import mongoConnect from "./configs/database";
import { config } from "./configs";
import express from "express";

const app = express();

app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use(ErrorHandler.handle);

mongoConnect()
  .then(() => {
    app.listen(config.port, () =>
      console.log(`Server running on port: ${config.port}`),
    );
  })
  .catch((error: unknown) => {
    console.error('MongoDB connection failed:\n', error);
    console.log('Server initialization cancelled');
    process.exit(1);
  });


