import express, { Request, Response } from 'express'
import cors from 'cors'
import { tab } from './data'
import { Empty, ErrorDesc, HttpCodeError, Task, TaskWioutId } from './types'
import bodyParser from 'body-parser'
import { v4 } from 'uuid'
import { badRequastHttpError, notFoundHttpError } from './httpError'
import { strParamsValidation, validatePatchTask } from './validation'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.get('/', (req: Request, res: Response<string>) => {
  console.log('test')
  res.send('Hello World!')
})

app.get<Empty, Task[]>('/tasks', (_req, res) => {
  res.send(tab)
})

app.get<{ id: string }, Task | ErrorDesc>('/tasks/:id', (req, res) => {
  const id = req.params.id
  const task = tab.find((t) => t.id === id)
  if (task) {
    return res.send(task)
  }
  return res.status(404).send(notFoundHttpError(id))
})

app.post<Empty, Task | ErrorDesc, TaskWioutId>('/tasks', (req, res) => {
  const { name, description } = req.body
  const checkBodyName = strParamsValidation(name, 5, 20)
  if (checkBodyName !== HttpCodeError.VALIDE_STR) {
    return res.status(400).send(badRequastHttpError('name', checkBodyName))
  }

  const checkBodyDescription = strParamsValidation(description, 10, 100)
  if (checkBodyDescription !== HttpCodeError.VALIDE_STR) {
    return res
      .status(400)
      .send(badRequastHttpError('description', checkBodyDescription))
  }
  const id = v4()
  const task = {
    id: id,
    name: name,
    description: description,
    status: { label: 'Created', startDate: Date.now() },
  }
  tab.push(task)
  return res.send(task)
})

app.patch<{ id: string }, Task | ErrorDesc, TaskWioutId>(
  '/tasks/:id',
  (req, res) => {
    // validate data object transfert
    const dtoValidation = validatePatchTask(req.body)
    if (dtoValidation !== true) return res.status(400).send(dtoValidation)
    // find corepanding task
    const { id } = req.params
    const currentTask = tab.find((e) => e.id === id)
    if (!currentTask) return res.status(404).send(notFoundHttpError(id))
    // patch the data
    const { name, description } = req.body
    if (name) currentTask.name = name
    if (description) currentTask.description = description

    return res.send(currentTask)
  }
)

app.delete<string, { id: string }, Empty, Task>('/tasks/:id', (req, res) => {
  const { id } = req.params
  const deleteTaskIndex = tab.findIndex((e) => e.id === id)
  if (deleteTaskIndex === -1) return res.status(404).send(notFoundHttpError(id))
  tab.splice(deleteTaskIndex, 1)
  return res.send(`TASK DELETED !`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
