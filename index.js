const express = require("express");
const server = express();
const mongoose = require("mongoose");
const ProductRouter = require("./routes/Products");
const CategoryRouter = require("./routes/Categories");
const BrandRouter = require("./routes/Brands");
const cors = require("cors");

// middlewares
server.use(cors({
  exposedHeaders:['X-Total-Count']
}));
server.use(express.json());
server.use("/products", ProductRouter.router);
server.use("/categories", CategoryRouter.router);
server.use("/brands", BrandRouter.router);

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
