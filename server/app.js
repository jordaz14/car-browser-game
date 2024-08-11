const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5501" }));

app.use(express.json());

app.get("/join-party", (req, res) => {
  res.json({ message: "hello, world!" });
});

app.listen(PORT, () => {
  console.log("Server is running.");
});
