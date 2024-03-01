import { ITasksStatusHistory, Task, TaskStatus } from './types'

export const tab: Task[] = []

type IStatusTrasition = {
  [k in TaskStatus]: TaskStatus[]
}
export const workflow: IStatusTrasition = {
  [TaskStatus.CREATED]: [TaskStatus.TODO, TaskStatus.DRAFT],
  [TaskStatus.DRAFT]: [TaskStatus.TODO],
  [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS, TaskStatus.DRAFT],
  [TaskStatus.IN_PROGRESS]: [
    TaskStatus.TO_VALIDATE,
    TaskStatus.DONE,
    TaskStatus.TODO,
  ],
  [TaskStatus.TO_VALIDATE]: [TaskStatus.DONE, TaskStatus.IN_PROGRESS],
  [TaskStatus.DONE]: [TaskStatus.ARCHIVED],
  [TaskStatus.ARCHIVED]: [],
}

export const tasks_status_history: ITasksStatusHistory = {
  // '<task-id1>': [
  //   {
  //     label: '<status_label>',
  //     startDate: 'the start date of status',
  //     endDate: 'the end date of status',
  //   },
  // ],
}
