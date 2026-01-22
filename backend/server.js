import express from 'express'
import pool from './config/db.js'
import { port as PORT } from './config/config.js'
import chalk from 'chalk'
import cors from 'cors'
import bcrypt from 'bcrypt'
import axios from 'axios'
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174']
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))
const saltRounds = 10

// GET all users
// app.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users')
//     console.log(chalk.blue('DB result rows:'), result.rows)

//     if (result.rows.length === 0) {
//       console.log(chalk.red('No users found in the database.'))
//     } else {
//       console.log(
//         chalk.green(`Fetched ${result.rows.length} users from the database.`)
//       )
//     }

//     res.json(result.rows)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'DB error' })
//   }
// })

// // POST new user
// app.post('/users', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, saltRounds)

//     const result = await pool.query(
//       'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
//       [name, email, hashedPassword]
//     )
//     res.json(result.rows[0])
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'DB insert error' })
//   }
// })

// // DELETE user by ID
// app.delete('/users/:id', async (req, res) => {
//   const { id } = req.params
//   try {
//     const result = await pool.query(
//       'DELETE FROM users WHERE id = $1 RETURNING *',
//       [id]
//     )

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' })
//     }

//     res.json({ message: 'User deleted successfully', user: result.rows[0] })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'DB delete error' })
//   }
// })

app.get('/ask', async (req, res) => {
  const question = req.query.question
  const gnANswers = ['creator','who made you', 'who develop you', "who create you"]
  const AIname = ['whats your name', "your name", "what they called you", "who are you"]
  if (!question)
    return res.status(400).json({ error: 'Please provide a question' })


  try {
    const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'mistralai/devstral-2512:free',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: question }
    ]
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
)

let answer = response.data.choices[0].message.content

if (gnANswers.some(gn => question.toLowerCase().includes(gn))) {
  res.json({ question, answer: '> the software enigineer named Ibraahim Baashe made me.' })
  return
}

if (AIname.some(ainame => question.toLowerCase().includes(ainame))) {
  res.json({ question, answer: '> My name is IBSX, and Im a large language model created by software enigineer named Ibraahim Baashe.' })
  return
}

answer = answer.replace(/Alibaba Cloud/gi, 'Ibraahim Baashe')
answer = answer.replace(/team/gi, 'man')
answer = answer.replace(/team of researchers and engineers at a company/gi, 'the software enigineer made me')

res.json({ question, answer })

  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
