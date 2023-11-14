const express = require("express");
const server = express();
const mongoose = require("mongoose");
const ProductRouter = require("./routes/Products");

// middlewares
server.use(express.json());
server.use("/products", ProductRouter.router);

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
