export interface Task {
  id: string
  name: string
  description: string
  status: { label: TaskStatus; startDate: Date }
}

export enum TaskStatus {
  CREATED = 'CREATED',
  DRAFT = 'DRAFT',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  TO_VALIDATE = 'TO_VALIDATE',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
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
  INACCESSIBLE_EVOLUTION = 'INACCESSIBLE_EVOLUTION',
}
export interface IStatusUpdate {
  label: TaskStatus
}
export type StatusHistoryType = {
  label: string
  startDate: Date
  endDate: Date
}

export interface ITasksStatusHistory {
  [id: string]: StatusHistoryType[]
}

export const SIGNALS = [
  'SIGABRT',
  'SIGALRM',
  'SIGBUS',
  'SIGCHLD',
  'SIGCONT',
  'SIGFPE',
  'SIGHUP',
  'SIGILL',
  'SIGINT',
  'SIGIO',
  'SIGIOT',
  'SIGKILL',
  'SIGPIPE',
  'SIGPOLL',
  'SIGPROF',
  'SIGPWR',
  'SIGQUIT',
  'SIGSEGV',
  'SIGSTKFLT',
  'SIGSTOP',
  'SIGSYS',
  'SIGTERM',
  'SIGTRAP',
  'SIGTSTP',
  'SIGTTIN',
  'SIGTTOU',
  'SIGUNUSED',
  'SIGURG',
  'SIGUSR1',
  'SIGUSR2',
  'SIGVTALRM',
  'SIGWINCH',
  'SIGXCPU',
  'SIGXFSZ',
  'SIGBREAK',
  'SIGLOST',
  'SIGINFO',
]
