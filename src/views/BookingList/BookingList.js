import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { BookingsToolbar, BookingsTable } from './components';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const BookingList = () => {
  const classes = useStyles();

  const [users] = useState(mockData);

  return (
    <div className={classes.root}>
      <BookingsToolbar />
      <div className={classes.content}>
        <BookingsTable users={users} />
      </div>
    </div>
  );
};

export default BookingList;
