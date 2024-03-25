import { badRequastHttpError } from './httpError'
import { ErrorDesc, HttpCodeError, TaskWioutId } from './types'

export const {
  MAX_LENGHT_ERROR,
  MIN_LENGHT_ERROR,
  EMPTY_STR_ERROR,
  VALIDE_STR,
} = HttpCodeError

export class StrParamsValidationMaxMin extends Error {
  constructor() {
    super('Error : min must be less then max')
  }
}
/**
 *
 * @param value value to check
 * @param minlength min length to check
 * @param maxlength max length to check
 * @returns value in enum representing error or validation success
 */
export const strParamsValidation = (
  value: string,
  minlength: number,
  maxlength: number
): HttpCodeError => {
  if (minlength >= maxlength) throw new StrParamsValidationMaxMin()
  if (!value) return EMPTY_STR_ERROR

  value = value.trim()

  if (value.length < minlength) {
    return MIN_LENGHT_ERROR
  }
  if (value.length > maxlength) {
    return MAX_LENGHT_ERROR
  }
  return VALIDE_STR
}
/**
 *
 * @param taskDto dto to check
 * @returns http error object or true
 */
export const validatePatchTask = (taskDto: TaskWioutId): ErrorDesc | true => {
  const { name, description } = taskDto
  // chack if data exist
  if (name !== null && name !== undefined) {
    const checkBodyName = strParamsValidation(name, 5, 20)
    if (checkBodyName !== HttpCodeError.VALIDE_STR) {
      return badRequastHttpError('name', checkBodyName)
    }
  }

  if (description !== null && description !== undefined) {
    const checkBodyDescription = strParamsValidation(description, 10, 100)
    if (checkBodyDescription !== HttpCodeError.VALIDE_STR) {
      return badRequastHttpError('description', checkBodyDescription)
    }
  }

  return true
}
