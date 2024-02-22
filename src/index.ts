import express, { Request, Response } from 'express'
import { tab } from './data'
import { Task } from './types'

const app = express()
const port = 3000

app.get('/', (req: Request, res: Response<string>) => {
  console.log('test')
  res.send('Hello World!')
})

app.get('/tasks', (req: Request, res: Response<Task[]>) => {
  res.send(tab)
})

app.get('/tasks/:id', (req: Request<{ id: string }>, res: Response<Task>) => {
  const id: number = parseInt(req.params.id)

  return res.send(tab.find((t) => t.id === id))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
