import express from "express";
import orderRoutes from "./routes/order.routes";
import mongoConnect from "./configs/database";
import { config } from "./configs";

const app = express();

app.use(express.json());

app.use("/api/sales", orderRoutes);

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


