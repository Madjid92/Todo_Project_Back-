import express, { Request, Response } from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { tab, tasks_status_history, workflow } from './data'
import {
  Empty,
  ErrorDesc,
  HttpCodeError,
  IStatusUpdate,
  ITasksStatusHistory,
  SIGNALS,
  StatusHistoryType,
  Task,
  TaskStatus,
  TaskWioutId,
} from './types'
import bodyParser from 'body-parser'
import { v4 } from 'uuid'
import {
  UpgradeStatusError,
  badRequastHttpError,
  notFoundHttpError,
  notFoundTaskHistoryError,
} from './httpError'
import { strParamsValidation, validatePatchTask } from './validation'

const app = express()
const port = 3000
const SAVE_TASK_FILE_PATH = 'data/tasks-data.json'
const SAVE_HISTORY_TASK_FILE_PATH = 'data/history-tasks-data.json'

export const loadHistoryTasksData = () => {
  const txtFilePathRead = path.resolve(SAVE_HISTORY_TASK_FILE_PATH)
  if (!fs.existsSync(txtFilePathRead)) return
  const fileContents = fs.readFileSync(txtFilePathRead, 'utf-8')
  if (!fileContents) return
  const dataSaved: ITasksStatusHistory = JSON.parse(fileContents)
  Object.entries(dataSaved).forEach((e) => {
    tasks_status_history[e[0]] = e[1]
  })
}

const loadTasksData = () => {
  const txtFilePathRead = path.resolve(SAVE_TASK_FILE_PATH)
  if (!fs.existsSync(txtFilePathRead)) return
  const fileContents = fs.readFileSync(txtFilePathRead, 'utf-8')
  if (!fileContents) return
  const dataSaved = JSON.parse(fileContents)
  tab.push(...dataSaved)
  return
}

loadTasksData()
loadHistoryTasksData()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.get('/', (_req: Request, res: Response<string>) => {
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
  const task: Task = {
    id: id,
    name: name,
    description: description,
    status: { label: TaskStatus.CREATED, startDate: new Date() },
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
  delete tasks_status_history[id]
  return res.send(`TASK DELETED !`)
})

app.put<string, { id: string }, IStatusUpdate | ErrorDesc, IStatusUpdate>(
  '/tasks/:id/status',
  (req, res) => {
    const { id } = req.params
    const { label } = req.body
    const currentTask = tab.find((e) => e.id === id)
    if (!currentTask) return res.status(404).send(notFoundHttpError(id))
    const currentStatus = currentTask.status.label
    const statusEvolution = workflow[currentStatus]
    const agreement = statusEvolution.find((e) => e === label)
    if (!agreement) return res.status(404).send(UpgradeStatusError(label))
    const currentDate = new Date()
    const taskStatusHistory: StatusHistoryType = {
      ...currentTask.status,
      endDate: currentDate,
    }
    const task_history = tasks_status_history[id]
    if (!Array.isArray(task_history)) {
      tasks_status_history[id] = [taskStatusHistory]
    } else {
      task_history.push(taskStatusHistory)
    }
    console.log(tasks_status_history)
    const newStatus = {
      label,
      startDate: currentDate,
    }
    currentTask.status = newStatus
    return res.send(newStatus)
  }
)

app.get<string, { id: string }, StatusHistoryType[] | ErrorDesc>(
  '/tasks/:id/status/history',
  (req, res) => {
    const { id } = req.params
    const task = tab.find((e) => e.id === id)
    if (!task) return res.status(404).send(notFoundTaskHistoryError(id))
    const task_history = tasks_status_history[id]
    if (!task_history) return res.send([])
    return res.send(task_history)
  }
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const saveHistoryTasksData = () => {
  const txtFilePathWrite = path.resolve(SAVE_HISTORY_TASK_FILE_PATH)
  fs.writeFileSync(txtFilePathWrite, JSON.stringify(tasks_status_history))
}

const saveTasksData = () => {
  const txtFilePathWrite = path.resolve(SAVE_TASK_FILE_PATH)
  fs.writeFileSync(txtFilePathWrite, JSON.stringify(tab))
  saveHistoryTasksData()
  console.log('fin de process ')
  process.exit()
}
SIGNALS.forEach((signal) => {
  process.on(signal, saveTasksData)
})
