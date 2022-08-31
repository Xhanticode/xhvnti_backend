const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Login fn
async function Login (req, res) {
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
              created_at: result[0].created_at,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;

              res.json({ 
                msg: "Login Successful",
                employee: payload.employee,
                token : token
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



// Register fn
async function Register (req, res) {
  try {
    let sql = `INSERT INTO employees (name, surname, email, phone, password, role, created_at) VALUES(? , ? , ? , ? , ? , ?);`;
    let date = new Date().toISOString().slice(0, 10);
    let { name, surname, email, phone, password, role, } = req.body;
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
      created_at: date,
    };
    con.query(
      sql,
      [
        employee.name,
        employee.surname,
        employee.email,
        employee.phone,
        employee.password,
        employee.role,
        employee.created_at,
      ],
      (err, result) => {
        if (err) throw err;
        // console.log(result);
        // res.json(`User ${(user.fullname, user.email)} created successfully`);
        res.json({
          msg: "Regitration Successful",
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function Verify (req, res) {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
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
  Login,
  Register,
  Verify,
};
