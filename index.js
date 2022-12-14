const express = require("express");
const cors = require("cors");
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(cors({
  mode: 'no-cors',
  origin: ['http://192.168.8.75:8080/', 'http://localhost:8080',
  'https://xhvnti.co.za/'],
  credentials: true
}));
app.use(express.json());
app.set("port", process.env.PORT || 5001);
app.get("/", (req, res) => {
  res.json({ msg: "X H V N T I" });
});

const employeesRoute = require("./routes/employeesRoute");
const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");

app.use("/employees", employeesRoute);
app.use("/users", usersRoute);
app.use("/products", productsRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});

module.exports = {
  devServer: {
    Proxy: "*",
  },
};
