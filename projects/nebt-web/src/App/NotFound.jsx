import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { responsivePadding } from '../theme'

const useStyles = makeStyles(theme => ({
  item: {
    ...theme.custom.flexColumnCentered,
    ...responsivePadding(theme)(true)
  },
  heading: {
    color: theme.palette.primary.main,
    textAlign: 'center'
  },
  subheading: {
    textAlign: 'center',
    letterSpacing: 0,
    marginBottom: 0
  }
}))

export default () => {
  const classes = useStyles()
  return (
    <Grid container>
      <Grid item xs={12} component="section" className={classes.item}>
        <Typography variant="h1" className={classes.heading}>
          404 Not Found
        </Typography>
        <Typography variant="h4" className={classes.subheading}>
          The requested page
          <br />
          doesn&apos;t exist
        </Typography>
      </Grid>
    </Grid>
  )
}
