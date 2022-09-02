const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Employee login
async function employeeLogin (req, res) {
  console.log(req.body);
  try {
    let sql = "SELECT * FROM employees WHERE ?";
    let employee = {
      email: req.body.email,
    };
    con.query(sql, employee, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(400).json({
          status: "error",
          msg: "Email Not Found",
        });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        console.log(req.body.password, result[0].password);
        if (!isMatch) {
          res.status(400).json({
            status: "error",
            msg: "Password Incorrect",
          });
          console.log(isMatch);
        } else {
          // The information that should be stored inside token
          const payload = {
            employee: {
              id: result[0].id,
              name: result[0].name,
              surname: result[0].surname,
              email: result[0].email,
              phone: result[0].phone,
              role: result[0].role,
            },
          };
          console.log(payload)
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;

              res.json({
                token :token
               });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}
// User login
async function userLogin (req, res) {
  console.log(req.body);
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(400).json({
          status: "error",
          msg: "Email Not Found",
        });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        console.log(req.body.password, result[0].password);
        if (!isMatch) {
          res.status(400).json({
            status: "error",
            msg: "Password Incorrect",
          });
          console.log(isMatch);
        } else {
          // The information that should be stored inside token
          const payload = {
            user: {
              user_id: result[0].user_id,
              name: result[0].name,
              surname: result[0].surname,
              email: result[0].email,
              phone: result[0].phone,
              shipping_address: result[0].shipping_address,
              cart: result[0].cart,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;

              res.json({ 
                msg: "Login Successful",
                user: payload.user,
                token : data.token
               });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}



// Employee register
async function employeeRegister (req, res) {
  try {
    let sql = `INSERT INTO employees SET ?`;
    let date = new Date();
    let { name, surname, email, phone, password, role, created_at=date } = req.body;
    if (role === "" || role === null) {
      role = "general employee";
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let employee = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      password: hash,
      role: role,
      created_at: created_at
    };
    console.log(employee);
    con.query( sql, employee, (err, result) => {
        if (err) throw err;
        
        console.log(result)
        res.send(result)

        // res.json({
        //   msg: "Regitration Successful",
        // });
      }
    );
  } catch (error) {
    console.log(error);
  }
}
// User register
async function userRegister (req, res) {
  try {
    let sql = `INSERT INTO users SET ?`;
    let date = new Date();
    console.log(date)
    let { name, surname, email, phone, password, shipping_address, cart, created_at=date } = req.body;
   
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let user = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      password: hash,
      shipping_address: shipping_address,
      cart: cart,
      created_at: created_at
    };
    console.log(user);
    con.query( sql, user, (err, result) => {
        if (err) throw err;
        
        console.log(result)
        res.send(result)

        // res.json({
        //   msg: "Regitration Successful",
        // });
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function Verify (req, res) {
  const token = req.header("x-auth-token");
  console.log(token)
  jwt.verify(token, process.env.SECRET_KEY, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
       
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
}

module.exports = {
  employeeLogin,
  userLogin,
  employeeRegister,
  userRegister,
  Verify,
};
