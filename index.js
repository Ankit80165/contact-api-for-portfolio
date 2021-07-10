const express = require('express');
const cors = require('cors');
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const config = require('./config');
const transporter = nodemailer.createTransport(config.mailer);

const app = express();

app.use(cors());
app.use(express.json());

app.post(
  "/contact",
  body("name").notEmpty().withMessage("Name should not be empty"),
  // password must be at least 5 chars long
  body("email").isEmail().withMessage("please enter a valid email"),
  body("subject").notEmpty().withMessage("please enter a valid email"),
  body("message").notEmpty().withMessage("Message should not be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        title: "Error",
        errors: errors.errors,
      });
    }
    const mailOptions = {
      from: "server@server.com",
      to: "romanreigns80165@gmail.com",
      subject: "Hey man you got a visitor",
      text: `message:${req.body.message}
              email: ${req.body.email}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("we got a error", err);
      } else {
        res.status(200).json({
          message: "CamEditor-A website to share your code",
        });
      }
    });
  }
);
app.listen(process.env.PORT || 3000);