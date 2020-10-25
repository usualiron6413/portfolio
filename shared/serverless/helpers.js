import { APP_PATH_MATCH } from '../raw/constants/regex'
import { fetchBundleFile } from './fetchers'

export const parsePathRequest = path => {
  const appName = path.replace(APP_PATH_MATCH, '$2')
  const appPath = path.replace(APP_PATH_MATCH, '$3')
  const result = {
    requestedApp: appName
  }
  if (appPath?.length) {
    result.requestedPath = appPath
  }
  return result
}

export const findMatchingApp = (name, appsList) =>
  appsList.split(',').some(app => app === name)

export const evalScriptString = (code, fileName) => {
  const result = eval(code)
  if (result[fileName]) return result[fileName]
}

export const getLocalBundleFile = async fileName => {
  try {
    let evaledCode = await fetchBundleFile(fileName)
    return evaledCode
  } catch (error) {
    console.error('getLocalBundleFile', error)
  }
}