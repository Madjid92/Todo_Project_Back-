export interface Task {
  id: string
  name: string
  description: string
  status: { label: TaskStatus; startDate: Date }
}

export enum TaskStatus {
  CREATED = 'CREATED',
}
export interface ErrorDesc {
  code: string
  message: string
}

export type TaskWioutId = Omit<Task, 'id' | 'status'>

export interface Empty {}

export enum HttpCodeError {
  RESSOUSE_NOT_FOUND = 'RESSOUSE_NOT_FOUND',
  MIN_LENGHT_ERROR = 'MIN_LENGHT_ERROR',
  MAX_LENGHT_ERROR = 'MAX_LENGHT_ERROR',
  EMPTY_STR_ERROR = 'EMPTY_STR_ERROR',
  VALIDE_STR = 'VALIDE_STR',
}
