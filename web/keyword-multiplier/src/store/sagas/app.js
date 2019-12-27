import { call, put, select, take, race, delay } from 'redux-saga/effects'
import { getRequest, postRequest } from '@colin30/web-shared/react/saga'
import { generateKey } from '@colin30/web-shared/react'
import {
  getCopySettings,
  getEnabledSets,
  getMatchType,
  getClientIp
} from '../selectors'
import types from '../types'
import constants from '../../App/constants'
import { processTrial, copyToClipboard, generateNotice } from '../../App/logic'

export function* multiplySets() {
  const notice = generateNotice('Check your results below')
  try {
    const enabled = yield select(state => getEnabledSets(state))
    let ip = yield select(state => getClientIp(state))
    if (!ip) {
      ip = yield call(getRequest, 'ip')
    }
    yield put({
      type: types.ADD_IP,
      ip
    })
    const posted =
      process.env.NODE_ENV === 'production'
        ? yield call(postRequest, 'trials', {
            sets: enabled,
            ip,
            slug: generateKey()
          })
        : {
            sets: enabled,
            slug: generateKey()
          }
    const trial = yield call(processTrial, posted)
    yield put({
      type: types.ADD_TRIAL,
      trial
    })
    yield put({
      type: types.SHOW_TRIAL,
      slug: trial.slug
    })
  } catch (error) {
    notice.bg = constants.NOTICE.BGS.FAIL
    notice.heading = 'Error'
    notice.message = error.message
  }
  yield put({
    type: types.ADD_NOTICE,
    notice
  })
  yield put({ type: types.SHOW_NOTICE })
  const { response } = yield race({
    response: take(types.TAKE_NOTICE_RESPONSE),
    timeout: delay(constants.NOTICE.TIMEOUT_DELAY)
  })
  if (response && response.choice === constants.NOTICE.RESPONSES.REJECT) {
  }
  yield put({ type: types.HIDE_NOTICE })
  yield delay(500)
  yield put({ type: types.REMOVE_NOTICE })
}

export function* copyTrial(action) {
  const notice = generateNotice(`Trial ${action.slug} copied to clipboard`)
  const copySettings = yield select(state => getCopySettings(state))
  const matchType = yield select(state => getMatchType(state))
  try {
    const { ref } = action
    yield call(copyToClipboard, ref, copySettings.dataOnly, matchType)
  } catch (error) {
    notice.bg = constants.NOTICE.BGS.FAIL
    notice.heading = 'Error'
    notice.message = error.message
  }
  yield put({
    type: types.ADD_NOTICE,
    notice
  })
  yield put({ type: types.SHOW_NOTICE })
  const { response } = yield race({
    response: take(types.TAKE_NOTICE_RESPONSE),
    timeout: delay(constants.NOTICE.TIMEOUT_DELAY)
  })
  if (response && response.choice === constants.NOTICE.RESPONSES.REJECT) {
  }
  yield put({ type: types.HIDE_NOTICE })
  yield delay(500)
  yield put({ type: types.REMOVE_NOTICE })
}

export function* copyAllTrials() {
  const notice = generateNotice('All trials copied to clipboard')
  const copySettings = yield select(state => getCopySettings(state))
  const matchType = yield select(state => getMatchType(state))
  try {
    const tbodys = document.getElementsByTagName('tbody')
    yield call(copyToClipboard, tbodys, copySettings.dataOnly, matchType)
  } catch (error) {
    notice.bg = constants.NOTICE.BGS.FAIL
    notice.heading = 'Error'
    notice.message = error.message
  }
  yield put({
    type: types.ADD_NOTICE,
    notice
  })
  yield put({ type: types.SHOW_NOTICE })
  const { response } = yield race({
    response: take(types.TAKE_NOTICE_RESPONSE),
    timeout: delay(constants.NOTICE.TIMEOUT_DELAY)
  })
  if (response && response.choice === constants.NOTICE.RESPONSES.REJECT) {
  }
  yield put({ type: types.HIDE_NOTICE })
  yield delay(500)
  yield put({ type: types.REMOVE_NOTICE })
}

export function* askDeleteTrial(action) {
  const { slug } = action
  const notice = generateNotice(
    `Are you sure you want to delete trial ${slug}?`,
    constants.NOTICE.KINDS.CHOICE
  )
  yield put({
    type: types.ADD_NOTICE,
    notice
  })
  yield put({ type: types.SHOW_NOTICE })
  const { response } = yield race({
    response: take(types.TAKE_NOTICE_RESPONSE),
    timeout: delay(constants.NOTICE.TIMEOUT_DELAY)
  })
  if (response && response.choice === constants.NOTICE.RESPONSES.ACCEPT) {
    yield put({ type: types.HIDE_NOTICE })
    yield delay(500)
    yield put({ type: types.REMOVE_NOTICE })
    yield put({ type: types.HIDE_TRIAL, slug })
    yield delay(250)
    yield put({ type: types.DELETE_TRIAL, slug })
  } else {
    yield put({ type: types.HIDE_NOTICE })
    yield delay(500)
    yield put({ type: types.REMOVE_NOTICE })
  }
}

export function* askDeleteAllTrials() {
  const notice = generateNotice(
    'Are you sure you want to delete all trials?',
    constants.NOTICE.KINDS.CHOICE
  )
  yield put({
    type: types.ADD_NOTICE,
    notice
  })
  yield put({ type: types.SHOW_NOTICE })
  const { response } = yield race({
    response: take(types.TAKE_NOTICE_RESPONSE),
    timeout: delay(constants.NOTICE.TIMEOUT_DELAY)
  })
  if (response && response.choice === constants.NOTICE.RESPONSES.ACCEPT) {
    yield put({ type: types.DELETE_ALL_TRIALS })
  }
  yield put({ type: types.HIDE_NOTICE })
  yield delay(500)
  yield put({ type: types.REMOVE_NOTICE })
}

export function* askResetAll(action) {
  const notice = generateNotice(
    'Are you sure you want to reset everything?',
    constants.NOTICE.KINDS.CHOICE
  )
  yield put({
    type: types.ADD_NOTICE,
    notice
  })
  yield put({ type: types.SHOW_NOTICE })
  const { response } = yield race({
    response: take(types.TAKE_NOTICE_RESPONSE),
    timeout: delay(constants.NOTICE.TIMEOUT_DELAY)
  })
  if (response && response.choice === constants.NOTICE.RESPONSES.ACCEPT) {
    yield call(action.handler, constants.SETS_FORM_NAME)
    yield put({ type: types.RESET_ALL_BUT_NOTICE })
  }
  yield put({ type: types.HIDE_NOTICE })
  yield delay(500)
  yield put({ type: types.REMOVE_NOTICE })
}