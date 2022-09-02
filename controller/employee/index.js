const con = require("../../lib/db_connection");
const bcrypt = require("bcryptjs");
const { addProduct } = require("../admin");
require("dotenv").config();

// Add employee
async function addEmployee(req, res) {
  const { name, surname, email, phone, password, role, created_at } =
    req.body;
  try {
    con.query(
      `INSERT INTO employees (
        name, 
        surname,
        email,
        phone,
        password,
        role,
        created_at,) values ("${name}","${surname}","${email}","${phone}","${password}","${role}","${created_at}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
// Edit employee
async function editEmployee(req, res) {
  const { name, surname, email, phone, password, created_at } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE employees SET name="${name}",surname="${surname}",email="${email}",phone="${phone}",password="${hash}",role="${role}",created_at="${created_at}" WHERE employee_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//Delete employee
async function deleteEmployee(req, res) {
  try {
    con.query(
      `DELETE FROM employees WHERE employee_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  editEmployee,
  deleteEmployee,
  addEmployee,
};
