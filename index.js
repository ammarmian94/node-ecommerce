const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const ProductRouter = require("./routes/Products");
const CategoryRouter = require("./routes/Categories");
const BrandRouter = require("./routes/Brands");
const UserRouter = require("./routes/User");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");

// middlewares
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use("/products", ProductRouter.router);
server.use("/categories", CategoryRouter.router);
server.use("/brands", BrandRouter.router);
server.use("/users", UserRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart", CartRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("Database Connected");
}

server.get("/", (req, res) => {
  res.json({ status: "listening" });
});

server.listen(8080, () => {
  console.log("Server is started");
});
