import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles(
  theme => ({
    container: {
      ...theme.custom.contentContainer,
      ...theme.custom.setFlex('column'),
      padding: `${theme.custom.setSpace('md')}px ${theme.custom.setSpace(
        'sm'
      )}px`,
      [theme.breakpoints.up('sm')]: {
        ...theme.custom.setFlex('row')
      }
    },
    image: {
      maxWidth: 260,
      [theme.breakpoints.up('sm')]: {
        height: 260
      }
    },
    tagline: {
      display: 'inline-block',
      ...theme.typography.shareTechMono,
      textTransform: 'uppercase',
      fontSize: theme.typography.fontSize * 3,
      textAlign: 'center',
      letterSpacing: -2,
      color: 'white',
      textShadow: `0 0 3px ${theme.palette.primary.main}`,
      margin: `${theme.custom.setSpace('sm')}px 0 0 0`,
      [theme.breakpoints.up('sm')]: {
        textAlign: 'left',
        margin: `0 0 0 ${theme.custom.setSpace('sm')}px`,
        maxWidth: '40%',
        fontSize: theme.typography.fontSize * 4
      }
    }
  }),
  {
    name: 'HeroBar'
  }
)

interface Props {
  src: string
  tagline: string
  alt: string
}

export const HeroBar: React.FC<Props> = ({
  src,
  tagline,
  alt
}): JSX.Element => {
  const classes = useStyles()
  return (
    <Grid className={classes.container}>
      <img src={src} className={classes.image} alt={alt} />
      <Typography variant="h1" className={classes.tagline}>
        {tagline}
      </Typography>
    </Grid>
  )
}