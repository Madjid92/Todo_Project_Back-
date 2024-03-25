import { describe, expect, test } from '@jest/globals'
import {
  EMPTY_STR_ERROR,
  MAX_LENGHT_ERROR,
  MIN_LENGHT_ERROR,
  StrParamsValidationMaxMin,
  VALIDE_STR,
  strParamsValidation,
} from './validation'
import {
  badRequastHttpError,
  notFoundHttpError,
  notFoundTaskHistoryError,
  upgradeStatusError,
} from './httpError'
import { HttpCodeError } from './types'

describe('Test string paramettre validation : strParamsValidation', () => {
  test('paramettre is valid', () => {
    expect(strParamsValidation('test', 2, 10)).toBe(VALIDE_STR)
    expect(strParamsValidation('tefs-ddfd-sf', 4, 18)).toBe(VALIDE_STR)
  })

  test('paramettre is less then minimal length', () => {
    expect(strParamsValidation('test', 5, 10)).toBe(MIN_LENGHT_ERROR)
    expect(strParamsValidation('tefs-ddfd-sf', 15, 18)).toBe(MIN_LENGHT_ERROR)
  })

  test('paramettre is less then maximal length', () => {
    expect(strParamsValidation('test', 1, 3)).toBe(MAX_LENGHT_ERROR)
    expect(strParamsValidation('tefs-ddfd-sf', 3, 10)).toBe(MAX_LENGHT_ERROR)
  })

  test('paramettre is empty', () => {
    expect(strParamsValidation('', 1, 3)).toBe(EMPTY_STR_ERROR)
  })

  test('uncoherent argument min/max', () => {
    expect(() => strParamsValidation('', 4, 3)).toThrow(
      StrParamsValidationMaxMin
    )
  })
})

describe('Test handling request http errors : badRequastHttpError', () => {
  test('parametter is greater than maximal length', () => {
    expect(badRequastHttpError('test', MAX_LENGHT_ERROR)).toStrictEqual({
      code: MAX_LENGHT_ERROR,
      message: `length of ${'test'} exceed`,
    })
  })
  test('parametter is less than minimal length', () => {
    expect(badRequastHttpError('test', MIN_LENGHT_ERROR)).toStrictEqual({
      code: MIN_LENGHT_ERROR,
      message: `length of ${'test'} under of minmal length`,
    })
  })
  test('empty parametter', () => {
    expect(badRequastHttpError('', EMPTY_STR_ERROR)).toStrictEqual({
      code: EMPTY_STR_ERROR,
      message: `param ${''} is empty`,
    })
  })
})

describe('Test task status evolution: UpgradeStatusError', () => {
  test('status are not available to upgrade', () => {
    expect(upgradeStatusError('DRAFT')).toStrictEqual({
      code: HttpCodeError.INACCESSIBLE_EVOLUTION,
      message: `We cannot change the status of this task to ${'DRAFT'}`,
    })
  })
})

describe(`Test task status history existence : notFoundTaskHistoryError`, () => {
  test(`task status history doesn't exst`, () => {
    expect(notFoundTaskHistoryError('5')).toStrictEqual({
      code: HttpCodeError.RESSOUSE_NOT_FOUND,
      message: `can't find task history with id ${'5'}`,
    })
  })
})

describe('Test task existance : notFoundHttpError', () => {
  test(`task doesn't exist`, () => {
    expect(notFoundHttpError('2')).toStrictEqual({
      code: HttpCodeError.RESSOUSE_NOT_FOUND,
      message: `can't find task with id ${'2'}`,
    })
  })
})
