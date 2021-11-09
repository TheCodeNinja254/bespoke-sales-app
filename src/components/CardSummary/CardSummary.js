import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    backgroundColor: (props) => props.cardBgColor || theme.palette.white,
    color: (props) => props.cardColor || theme.palette.text.secondary,
    '& p': {
      color: (props) => props.cardColor || theme.palette.text.secondary
    },
    '& h3': {
      color: (props) => props.cardColor || theme.palette.text.secondary
    }
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: (props) => props.iconBgColor || theme.palette.success.main,
    height: 56,
    width: 56
  }
}));

const CardSummary = (props) => {
  const classes = useStyles(props);
  const { cardTopic, cardIcon, cardValue, children, className = '' } = props;
  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              {cardTopic}
            </Typography>
            <Typography variant="h3">{cardValue}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>{cardIcon}</Avatar>
          </Grid>
        </Grid>
        {children}
      </CardContent>
    </Card>
  );
};

export default CardSummary;
