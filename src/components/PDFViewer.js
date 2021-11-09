import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Document, Page, pdfjs } from 'react-pdf';
import Pagination from '@material-ui/lab/Pagination';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPaginationItem-page.Mui-selected': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.white
    }
  },
  footer: {
    left: 0,
    bottom: 0,
    boxShadow: '0 -10px 30px 0 rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    position: 'fixed',
    width: '100%',
    backgroundColor: theme.palette.white,
    color: theme.palette.black.main,
    padding: '5px 5px 10px 5px',
    borderRadius: 0
  },
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const PDFViewer = ({ src, width, height, loader }) => {
  const classes = useStyles();
  const [pdfDetails, setPdfDetails] = React.useState({
    totalPages: 1,
    currentPage: 1
  });
  const { totalPages, currentPage } = pdfDetails;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfDetails({ totalPages: numPages, currentPage });
  };

  const changePage = (event, value) => {
    setPdfDetails({ totalPages, currentPage: Number(value) });
  };

  return (
    <div className={classes.root}>
      <Document
        loading={loader}
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          width={width}
          height={height}
          scale={1}
          pageNumber={currentPage}
        />
      </Document>
      <div className={classes.footer}>
        <div className={classes.paginationWrapper}>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className={classes.paginationWrapper}>
          <Pagination
            size="medium"
            count={totalPages}
            page={currentPage}
            onChange={changePage}
          />
        </div>
      </div>
    </div>
  );
};

PDFViewer.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default React.memo(PDFViewer);
