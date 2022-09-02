const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");

const nodemailer = require("nodemailer");
require("dotenv").config();

// Forgot employee password
async function forgotEmployeePsw(req, res) {
  try {
    let sql = "SELECT * FROM employees WHERE ?";
    let employee = {email: req.body.email};
    con.query(sql, employee, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("Email not found");
      } else {
        // Allows me to connect to the given email account || Your Email
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          auth: {
            user: "sierra7@ethereal.email",
            pass: "khJPKTuJNd1zVYGWJT",
          },
        });

        // How the email should be sent out
        var mailData = {
          from: process.env.MAILERUSER,
          // Sending to the person who requested
          to: result[0].email,

          subject: "Password Reset",
          html: `<div>
            <h3>Hi ${result[0].name},</h3>
            <br>
            <p>A request has been made to reset your password</p>
            <br>

            <h4>Click link below to reset your password</h4>

            <a href="https://xhvnti.herokuapp.com/reset_employee_psw.html">
              Click Here to Reset Password
              user_id = ${result[0].id}
            </a>

            <br>
            <p>For any queries feel free to contact us...</p>
            <div>
              Email: ${process.env.MAILERUSER}
              <br>
              Tel: 084 942 7416
            <div>
          </div>`,
        };

        // Check if email can be sent
        // Check password and email given in .env file
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email valid! ", success);
          }
        });

        transporter.sendMail(mailData, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.status(200).json({
              status: "ok",
              data: result,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// Forgot user password
async function forgotUserPsw(req, res) {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {email: req.body.email};
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("Email not found");
      } else {
        // Allows me to connect to the given email account || Your Email
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          auth: {
            user: "sierra7@ethereal.email",
            pass: "khJPKTuJNd1zVYGWJT",
          },
        });

        // How the email should be sent out
        var mailData = {
          from: process.env.MAILERUSER,
          // Sending to the person who requested
          to: result[0].email,

          subject: "Password Reset",
          html: `<div>
            <h3>Hi ${result[0].name},</h3>
            <br>
            <p>A request has been made to reset your password</p>
            <br>

            <h4>Click link below to reset your password</h4>

            <a href="https://xhvnti.herokuapp.com/reset_user_psw.html">
              Click Here to Reset Password
              user_id = ${result[0].id}
            </a>

            <br>
            <p>For any queries feel free to contact us...</p>
            <div>
              Email: ${process.env.MAILERUSER}
              <br>
              Tel: 084 942 7416
            <div>
          </div>`,
        };

        // Check if email can be sent
        // Check password and email given in .env file
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email valid! ", success);
          }
        });

        transporter.sendMail(mailData, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.status(200).json({
              status: "ok",
              data: result,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function resetUserPsw(req, res) {
  // try{
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    user_id: req.params.id,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        name: result[0].name,
        surname: result[0].surname,
        email: result[0].email,
        phone: result[0].phone,
        shipping_address: result[0].shipping_address,
        cart: result[0].cart,

        // Only thing im changing in table
        password: hash,
        
        created_at: result[0].created_at
      };

      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json("Password succesfully changed, please login");
      });
    }
  });
  // }
}

// Reset employee password
async function resetEmployeePsw(req, res) {
  // try{
  let sql = "SELECT * FROM employees WHERE ?";
  let employee = {
    employee_id: req.params.id,
  };
  con.query(sql, employee, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE employees SET ? WHERE employee_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        name: result[0].name,
        surname: result[0].surname,
        email: result[0].email,
        phone: result[0].phone,

        // Only thing im changing in table
        password: hash,

        role: result[0].role,
        created_at: result[0].created_at
      };

      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json("Password succesfully changed, please login");
      });
    }
  });
  // }
}
module.exports = {
  forgotUserPsw,
  forgotEmployeePsw,
  resetUserPsw,
  resetEmployeePsw,
};
