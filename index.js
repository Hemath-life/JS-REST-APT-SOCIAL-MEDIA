//------------------------ [ modules ] ---------------------------
const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet")                                            // for headers security purpose
const morgan = require("morgan")
const bodyParser = require("body-parser")
require('dotenv').config();
const cors = require("cors")
const multer = require("multer")
const path = require("path")



//---------------------[ Init express app ] ----------------
const app = express();



// ----------------  [ Built in  middleware ]-------------------
app.use(helmet())
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(cors())

const storage = multer.diskStorage({
          destination: (req, file, cb) => {
                    cb(null, "public/images")
          },
          filename: (req, file, cb) => {
                    cb(null, file.originalname)
          }
})
const upload = multer({ storage });






//------------------=- [ custom modules ] ----------------
const userRoute = require("./Router/users");
const authRoute = require("./Router/auth");
const postRoute = require("./Router/post");
app.post("/upload", upload.single("file"), (req, res) => {
          try {
                    return res.status(200).json("file uploadded success")
          } catch (error) {
                    console.log(err)
          }
})



// ------------- [ Custom middleware Route ] -----------------
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)




// --------------  [ connecting to mongodb atlas ]--------------
// mongodb://localhost:27017/
mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => err ? console.log(`err to connect mongoDB ${err}`) : console.log(`connected to mongodb atlas`));




/* -------------------- [ ROUTERS ] -------------------------*/
app.get("/", (req, res) => {
          res.json({ name: "good Morning" })
})
app.post("/", (req, res) => {
          console.log(req.body)
          // res.send("this is working")
})




// ----------------  [ PORT SECTION ]-------------------
const port = process.env.PORT || 8800
app.listen(port, function () {
          console.log(`Server started on port ${port}`);
});