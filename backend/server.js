import express from 'express'
import { port as PORT } from './config/config.js'
import cors from 'cors'
import axios from 'axios'
import pool from './config/db.js'
const allowedOrigins = [
  'https://fullstack-codewave-nine.vercel.app',
  'https://fullstack-codewave-7t8bl9mf8-ibraahimgit-ibs-projects.vercel.app',
  'http://localhost:5000',
  "http://localhost:5173"
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS >'))
    }
  },
  methods: ['GET', 'POST']
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))

app.get('/ask', async (req, res) => {
  const question = req.query.question
  const gnANswers = [
    'creator',
    'who made you',
    'who develop you',
    'who create you'
  ]
  const AIname = [
    'whats your name',
    'your name',
    'what they called you',
    'who are you'
  ]
  if (!question)
    return res.status(400).json({ error: 'Please provide a question' })

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nvidia/nemotron-nano-9b-v2:free',
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
      res.json({
        question,
        answer: '> the software enigineer named Ibraahim Baashe made me.'
      })
      return
    }

    if (AIname.some(ainame => question.toLowerCase().includes(ainame))) {
      res.json({
        question,
        answer:
          '> My name is IBSX, and Im a large language model created by software enigineer named Ibraahim Baashe.'
      })
      return
    }

    answer = answer.replace(/Alibaba Cloud/gi, 'Ibraahim Baashe')
    answer = answer.replace(/team/gi, 'man')
    answer = answer.replace(
      /team of researchers and engineers at a company/gi,
      'the software enigineer made me'
    )

    res.json({ question, answer }, "go away ........")
  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: 'Something went wrong', error })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
