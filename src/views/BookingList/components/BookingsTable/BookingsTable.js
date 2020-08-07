import React, { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const BookingsTable = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [bookings, setBookings] = useState([]);

  const handlePageChange = (event, page) => {
    getBookings(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const sharingApiUrl = `${process.env.REACT_APP_SHARING_API_URL}`;
  const sharingApiKey = `${process.env.REACT_APP_SHARING_API_KEY}`;

  const getBookings = page => {
    axios
      .post(sharingApiUrl + '/client/token', {
        apiKey: sharingApiKey,
        grantType: 'access_token'
      })
      .then(response => {
        const token = response.data.data.accessToken;
        axios
          .post(
            sharingApiUrl + '/admin/booking',
            {
              pageNo: page + 1,
              pageRows: rowsPerPage,
              targetReqDto: {
                subscriberName: '박혜미'
              }
            },
            { headers: { xClientToken: token } }
          )
          .then(response => {
            const data = response.data.data;
            setBookings(data.rows);
            setTotalRows(data.totalRows);
            setPage(data.pageNo - 1);
            // setLastPageNo(Math.ceil(data.totalRows / data.pageRows));
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    getBookings(page);
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>예약일시</TableCell>
                  <TableCell>예약번호</TableCell>
                  <TableCell>예약상태</TableCell>
                  <TableCell>차량번호</TableCell>
                  <TableCell>대여시각</TableCell>
                  <TableCell>반납시각</TableCell>
                  <TableCell>예약자명</TableCell>
                  <TableCell>연락처</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.slice(0, rowsPerPage).map(booking => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={booking.bookingNo}>
                    <TableCell>{booking.createdAt.replace('T', ' ')}</TableCell>
                    <TableCell>{booking.bookingNo}</TableCell>
                    <TableCell>{booking.bookingStatus}</TableCell>
                    <TableCell>{booking.vehicleNo}</TableCell>
                    <TableCell>{booking.startAt.replace('T', ' ')}</TableCell>
                    <TableCell>{booking.returnAt.replace('T', ' ')}</TableCell>
                    <TableCell>{booking.subscriberName}</TableCell>
                    <TableCell>{booking.subscriberContact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

BookingsTable.propTypes = {
  className: PropTypes.string
};

export default BookingsTable;
