const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const postgres = require("postgres");
require("dotenv").config();

/* DB CONNECTION */
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

/* ROUTE HANDLERS */

// REFRESHES LEADERBOARD
app.get("/refresh-leaderboard/:partyId", async (req, res) => {
  try {
    // Extract requested party id
    let partyId = req.params.partyId;
    partyId = parseInt(partyId);

    // Query usernames & scores for given party id
    const leaderboard = await sql`
    SELECT username, score 
    FROM leaderboard 
    WHERE party_id = ${partyId} 
    ORDER BY score DESC`;

    res.status(200).json({ message: "PARTY JOINED", data: leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
});

// JOINS/CREATES PARTY
app.post("/join-party", async (req, res) => {
  try {
    // Extract name of party
    let { party } = req.body;

    party = party.toUpperCase();

    // Query party id data for given party
    const partyData = await sql`
    SELECT party_id
    FROM party
    WHERE party_name = ${party}`;

    // If party exists
    if (partyData.length > 0) {
      // Isolate id number
      const partyId = partyData[0].party_id;

      res.json({ message: "PARTY FOUND", data: partyId });
    }
    // If party doesn't exist, create party
    else {
      // Create party in table
      await sql`
      INSERT INTO party (party_name) 
      VALUES (${party})`;

      // Query party id data for new party
      const newPartyData = await sql`
      SELECT party_id
      FROM party
      WHERE party_name = ${party}`;

      // Isolate id number for new party
      const newPartyId = newPartyData[0].party_id;

      res.json({ message: "PARTY CREATED", data: newPartyId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// SUBMITS USER'S SCORE
app.post("/submit-score", async (req, res) => {
  try {
    // Extract req
    let { username, partyId, score } = req.body;

    // Standardize username format
    username = username.toUpperCase();

    // Query for user data for given username
    const users = await sql`
    SELECT username, score
    FROM leaderboard
    WHERE username = ${username} AND party_id = ${partyId}`;

    // If user exists
    if (users.length > 0) {
      // If submitted score > existing db score
      if (score > users[0].score) {
        // Update user score
        await sql`
        UPDATE leaderboard
        SET score = ${score} 
        WHERE username = ${username} AND party_id = ${partyId}`;
        res.status(200).json({ message: "SCORE UPDATED" });
      } else {
        console.log("EXISTING SCORE EXCEEDS NEW SCORE");
        res.status(200).json({ message: "EXISTING SCORE EXCEEDS NEW SCORE" });
      }
    }
    // If user doesn't exist
    else {
      // Create user
      await sql`
      INSERT INTO leaderboard (username, party_id, score)
      VALUES (${username}, ${partyId}, ${score})`;
      res.status(201).json({ message: "USER CREATED" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running.");
});
