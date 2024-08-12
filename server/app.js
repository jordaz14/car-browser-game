const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5501" }));
app.use(express.json());

const postgres = require("postgres");
require("dotenv").config();

// DB CONNECTION
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();

// ROUTE HANDLERS
app.get("/", async (req, res) => {
  try {
    const leaderboard = await sql`
    SELECT * FROM leaderboard WHERE party = 'global'`;

    console.log(leaderboard);

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/join-party", (req, res) => {
  res.json({ message: "hello, world!" });
});

app.post("/submit-score", async (req, res) => {
  try {
    const { username, party, score } = req.body;
    console.log(username, party, score);

    await sql`
    INSERT INTO leaderboard (username, party, score)
    VALUES (${username}, ${party}, ${score})`;

    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.listen(PORT, () => {
  console.log("Server is running.");
});
