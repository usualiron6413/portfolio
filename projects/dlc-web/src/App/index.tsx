import { switchLinkRoutePath } from '@cjo3/shared/react/helpers'
import { CssBaseline, Snackbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { SNACKBAR_TIMEOUT } from '../constants'
import { closeSnackbar } from '../store/app/actions'
import { Snackbar as ISnackbar } from '../store/app/interfaces'
import { snackbarSelector } from '../store/selectors'
import { Editor } from './Editor'
import { ExportPanel } from './Editor/ExportPanel'
import { Footer } from './Footer'
import { Home } from './Home'
import { NotFound } from './NotFound'
import { TopNav } from './TopNav'

const useStyles = makeStyles(theme => ({
  App_pageContainer: {
    ...theme.custom.setGrid(12, 'auto 1fr auto'),
    ...theme.custom.fullScreen
  },
  App_topNavPosition: {
    gridColumn: '1 / 13',
    gridRow: 1
  },
  App_contentPosition: {
    ...theme.custom.setFlex('column', 'flex-start'),
    gridColumn: '1 / 13',
    gridRow: 2
  },
  App_footerPosition: {
    gridColumn: '1 / 13',
    gridRow: 3
  }
}))

export const App: React.FC = (): JSX.Element => {
  const classes = useStyles()

  const dispatch = useDispatch()

  let withNav = false

  const location = useLocation()

  withNav = location.pathname.includes('editor')

  const snackbar: ISnackbar = useSelector(snackbarSelector)

  let snackbarTimeout

  const closeSnackbarHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    reason: string
  ): void => {
    if (snackbarTimeout && reason === 'clickaway') {
      dispatch(closeSnackbar())
      clearTimeout(snackbarTimeout)
    } else {
      snackbarTimeout = setTimeout(() => {
        dispatch(closeSnackbar())
      }, SNACKBAR_TIMEOUT)
    }
  }

  return (
    <CssBaseline>
      <div className={classes.App_pageContainer}>
        <Snackbar
          key={snackbar.key}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          open={snackbar.open}
          onClose={closeSnackbarHandler}
          message={snackbar.message}
        />
        {withNav && <TopNav style={classes.App_topNavPosition} />}
        <div className={classes.App_contentPosition}>
          <Switch>
            <Route
              path={switchLinkRoutePath('/', process.env.APP_ROOT_PATH)}
              exact
              component={Home}
            />
            <Route
              path={switchLinkRoutePath(
                '/editor',
                `${process.env.APP_ROOT_PATH}/editor`
              )}
              exact
              component={Editor}
            />
            <Route path="/test" exact component={ExportPanel} />
            <Route path="/*" component={NotFound} />
          </Switch>
        </div>
        <Footer style={classes.App_footerPosition} />
      </div>
    </CssBaseline>
  )
}
