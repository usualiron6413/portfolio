import { call, put, select, take, race, delay } from 'redux-saga/effects'
import { fetchKeData, postOrderRequest } from '../fetchers'
import { types } from '../types'
import { decorateKeOptions, generateNotice } from '../../App/logic'
import {
  creditsMock,
  optionsMock
} from '@colin30/shared/react/mocks/keywordMultiplier'
import { constants } from '@colin30/shared/raw/constants/keywordMultiplier'
import { createHashId } from '@colin30/shared/react/helpers'

export function* getKeOptions() {
  try {
    const { countries, currencies } = yield select(state => state.kE)
    if (!countries || !currencies) {
      let result = optionsMock
      if (process.env.NODE_ENV !== 'development') {
        result = yield call(fetchKeData, Object.keys(constants.ENDPOINTS)[0])
      }
      const decoratedData = decorateKeOptions(result.data)
      return yield put({
        type: types.SET_KE_OPTIONS,
        ...decoratedData
      })
    }
    return null
  } catch (error) {}
}

export function* getKeCredits() {
  try {
    let result = creditsMock
    if (process.env.NODE_ENV !== 'development') {
      result = yield call(fetchKeData, Object.keys(constants.ENDPOINTS)[1])
    }
    const credits = result?.data.credits[0]

    if (credits < constants.LOW_CREDIT_ALERT_THRESHOLD) {
      console.warn(
        '%c low credit warning',
        'color: orange; font-size: large',
        credits
      )
    }

    yield put({
      type: types.SET_KE_CREDITS,
      credits
    })
  } catch (error) {
    console.error('%c getKeCredits', 'color: red; font-size: large', error)
  }
}

export function* orderMetrics(action) {
  try {
    const orderRequest = yield select(state => state.kE.orderRequest)
    const returnedMetrics = yield call(
      postOrderRequest,
      orderRequest,
      action.values.country,
      action.values.currency,
      action.values.dataSource
    )
    yield put({
      type: types.SET_KE_CREDITS,
      credits: returnedMetrics.credits
    })
    const oldTrial = yield select(state =>
      state.app.trials.items.find(trial => trial.id === orderRequest.trialId)
    )
    const updatedTrial = {
      ...oldTrial,
      volumeData: returnedMetrics.data,
      updatedAt: new Date().getTime(),
      orderId: createHashId()
    }
    yield put({
      type: types.UPDATE_TRIAL,
      updatedTrial
    })
  } catch (error) {
    console.error('%c error', 'color: red; font-size: large', error)
  }
  yield put({
    type: types.ADD_USER_KE_SELECTIONS,
    country: action.values.country,
    currency: action.values.currency,
    dataSource: action.values.dataSource
  })
}
