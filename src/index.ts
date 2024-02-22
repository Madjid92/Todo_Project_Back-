import express, { Request, Response } from 'express'
import cors from 'cors'
import { tab } from './data'
import { Empty, Task } from './types'
import bodyParser from 'body-parser'
import { v4 } from 'uuid'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.get('/', (req: Request, res: Response<string>) => {
  console.log('test')
  res.send('Hello World!')
})

app.get('/tasks', (req: Request, res: Response<Task[]>) => {
  res.send(tab)
})

app.get('/tasks/:id', (req: Request<{ id: string }>, res: Response<Task>) => {
  const id = req.params.id

  return res.send(tab.find((t) => t.id === id))
})

app.post<Empty, Task, Omit<Task, 'id'>>('/tasks', (req, res) => {
  const { name, description } = req.body
  const id = v4()
  const task = { id: id, name: name, description: description }
  tab.push(task)
  return res.send(task)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
