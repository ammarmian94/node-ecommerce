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
const OrderRouter = require("./routes/Order");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const { User } = require("./model/User");
const crypto = require("crypto");
const { isAuth, sanitizeUser } = require("./services/common");

const SECRET_KEY = "SECRET_KEY";

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;
// middlewares
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use("/products", isAuth(), ProductRouter.router);
server.use("/categories", isAuth(), CategoryRouter.router);
server.use("/brands", isAuth(), BrandRouter.router);
server.use("/users", isAuth(), UserRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart", isAuth(), CartRouter.router);
server.use("/orders", isAuth(), OrderRouter.router);

// Passport Strategy Local
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
          return done(null, false, { message: "Invalid Credentials" });
        }

        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "Invalid Credentials" });
            } else {
              const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
              return done(null, token); //this call serializeUser
            }
          }
        );
      } catch (error) {
        console.log("catch");
        done(error);
      }
    }
  )
);

// Passport Strategy JWT
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serialize;
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  // console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this creates session variable req.user when called from authorized user
// called on every authorized call
passport.deserializeUser(function (user, cb) {
  // console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

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
