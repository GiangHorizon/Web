require('dotenv').config();
const express = require("express");
const cors = require("cors");//Cross-Origin Resource Sharing: tac dung de frontend goi backend du cho khac port
const pool = require("./db");
const bcrypt = require("bcrypt");// su dung de ma hoa password truoc khi luu vao database
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());// su dung Middleware cors de cho phep frontend goi backend
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.post("/register", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const checkUser = await pool.query(
      "SELECT * FROM accounts WHERE username = $1 OR email = $2", 
      [username, email]
    );
    
    if (checkUser.rows.length > 0) {
      const existingAccount = checkUser.rows[0];
      if (existingAccount.username === username) {
        return res.status(400).json({ error: "This username already exists" });
      }
      if (existingAccount.email === email) {
        return res.status(400).json({ error: "This email is already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO accounts(name, email, username, password) VALUES($1, $2, $3, $4) RETURNING id, name, email, username",
      [name, email, username, hashedPassword]
    );

    res.status(201).json({
      message: "Register successful!",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Error register: ", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM accounts WHERE username = $1 OR email = $2", 
      [username, username]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    const account = result.rows[0];

    const kt = await bcrypt.compare(password, account.password);

    if (!kt) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    res.json({ 
      message: "Login successful!",
      user: { 
        id: account.id, 
        name: account.name,
        email: account.email,
        username: account.username 
      }
    });

  } catch (err) {
    console.error("Error login: ", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/family_tree', async (req, res) => {
  try {
    const selectedGen = req.query.generation; 
    let queryText = `
      WITH RECURSIVE family_tree AS (
          --Goc
          SELECT id, name, father_id, mother_id, date_birth, date_death, 1 AS generation 
          FROM members 
          WHERE father_id IS NULL AND mother_id IS NULL
          
          UNION ALL

          -- Tầng đệ quy
          SELECT mb.id, mb.name, mb.father_id, mb.mother_id, mb.date_birth, mb.date_death, ft.generation + 1
          FROM members mb
          INNER JOIN family_tree ft ON mb.father_id = ft.id
      )
      SELECT DISTINCT id, name, father_id, mother_id, date_birth, date_death, generation 
      FROM family_tree
    `;

    const queryParams = [];
    if (selectedGen && selectedGen !== 'all') {
      queryText += ` WHERE generation <= $1`;
      queryParams.push(parseInt(selectedGen));
    }

    queryText += ` ORDER BY generation ASC, date_birth ASC`;

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  res.status(500).json({
    error: err.message
  });
  }
});

app.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}`);
});