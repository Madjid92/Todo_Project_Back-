import { ErrorDesc, HttpCodeError } from './types'

export const notFoundHttpError = (id: string) => {
  return {
    code: HttpCodeError.RESSOUSE_NOT_FOUND,
    message: `can't find task with id ${id}`,
  }
}

const { MAX_LENGHT_ERROR, MIN_LENGHT_ERROR, EMPTY_STR_ERROR } = HttpCodeError
/**
 *
 * @param paramName the name of pram having error
 * @param error the error code to map with objet message
 * @returns error object
 */
export const badRequastHttpError = (
  paramName: string,
  error: HttpCodeError
): ErrorDesc => {
  switch (error) {
    case MAX_LENGHT_ERROR: {
      return {
        code: MAX_LENGHT_ERROR,
        message: `length of ${paramName} exceed `,
      }
    }
    case MIN_LENGHT_ERROR: {
      return {
        code: MIN_LENGHT_ERROR,
        message: `length of ${paramName} under of minmal length `,
      }
    }

    case EMPTY_STR_ERROR: {
      return {
        code: EMPTY_STR_ERROR,
        message: `param ${paramName} is empty `,
      }
    }
    default:
      throw Error('Cant find error case')
  }
}
