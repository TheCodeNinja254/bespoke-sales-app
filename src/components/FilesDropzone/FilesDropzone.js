/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreIcon from '@material-ui/icons/MoreVert';
import bytesToSize from '../../utils/bytesToSize';
import { Dialog, StatusIcon } from '../index';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButton-containedSecondary:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: theme.palette.action.active,
    opacity: 0.5
  },
  image: {
    width: 130
  },
  info: {
    marginTop: theme.spacing(1)
  },
  list: {
    maxHeight: 320
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  dialogContent: {
    textAlign: 'center'
  },
  removeButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  }
}));

function FilesDropzone({
  className,
  acceptedFileTypes,
  setFieldValue,
  name = 'fileDetails',
  ratio,
  dimension,
  ...rest
}) {
  // please not that ratio should only be used when you are dealing with images
  // ratio should be a float number. also it should be accompanied by the deciding dimension
  // for example ratio = 3.6 dimension = 'width'
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [fileMessage, setFileMessage] = useState({
    open: false,
    status: false,
    message: ''
  });
  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        // issue an error
        setFileMessage({
          open: true,
          status: false,
          message: 'Please only select one file'
        });
      } else if (ratio && dimension) {
        // FileReader() asynchronously reads the contents of files (or raw data buffers) stored on the user's computer.
        const reader = new FileReader();
        // eslint-disable-next-line func-names
        reader.onload = function (entry) {
          // The Image() constructor creates a new HTMLImageElement instance.
          const image = new Image();
          image.src = entry.target.result;
          // eslint-disable-next-line func-names
          image.onload = function () {
            // eslint-disable-next-line react/no-this-in-sfc
            const { height, width } = this;
            if (dimension === 'width') {
              const result = Math.round(width / ratio);
              const addBuffer = result + 15;
              const minusBuffer = result - 15;
              if (height <= addBuffer && height >= minusBuffer) {
                setFieldValue(name, acceptedFiles, true);
                // for now override what we had before since we just need one
                setFiles(acceptedFiles);
              } else {
                setFileMessage({
                  open: true,
                  status: false,
                  message: `Please use an image in the ratio of ${ratio}:1`
                });
              }
            }
            if (dimension === 'height') {
              const result = Math.round(height / ratio);
              const addBuffer = result + 15;
              const minusBuffer = result - 15;
              if (width <= addBuffer && width >= minusBuffer) {
                setFieldValue(name, acceptedFiles, true);
                // for now override what we had before since we just need one
                setFiles(acceptedFiles);
              } else {
                setFileMessage({
                  open: true,
                  status: false,
                  message: `Please use an image in the ratio of 1:${ratio}`
                });
              }
            }
          };
        };
        reader.readAsDataURL(acceptedFiles[0]);
      } else {
        setFieldValue(name, acceptedFiles, true);
        // for now override what we had before since we just need one
        setFiles(acceptedFiles);
      }
    },
    [setFieldValue, name, dimension, ratio]
  );

  const handleRemoveAll = () => {
    setFieldValue(name, [], true);
    setFiles([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: acceptedFileTypes
  });

  const { open, status, message } = fileMessage;

  const closeDialog = () => {
    setFileMessage({ open: false, status: false, message: '' });
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Dialog
        open={open}
        modalContent={
          <Box className={classes.dialogContent}>
            <StatusIcon status={status ? 'success' : 'error'} />
            <Typography variant="body1"> {message}</Typography>
          </Box>
        }
        modalActions={
          <Button
            variant="contained"
            onClick={() => closeDialog()}
            color="primary"
            autoFocus>
            Close
          </Button>
        }
        handleClose={closeDialog}
      />
      <div
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive
        })}
        {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          <img
            alt="Select file"
            className={classes.image}
            src="/images/undraw_add_file2_gvbb.svg"
          />
        </div>
        <div>
          <Typography gutterBottom variant="h3">
            Select file
          </Typography>
          <Box mt={2}>
            <Typography color="textPrimary" variant="body1">
              Drop files here or click{' '}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link underline="always">browse</Link> through your machine
            </Typography>
          </Box>
        </div>
      </div>
      {files.length > 0 && (
        <>
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <List className={classes.list}>
              {files.map((file, i) => (
                <ListItem divider={i < files.length - 1} key={i}>
                  <ListItemIcon>
                    <FileCopyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'h5' }}
                    secondary={bytesToSize(file.size)}
                  />
                  <Tooltip title="More options">
                    <IconButton edge="end">
                      <MoreIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </PerfectScrollbar>
          <div className={classes.actions}>
            <Button
              onClick={handleRemoveAll}
              size="small"
              color="secondary"
              className={clsx(classes.removeButton, 'removeFiles')}
              variant="contained">
              Remove all
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

FilesDropzone.propTypes = {
  className: PropTypes.string,
  ratio: PropTypes.number,
  dimension: PropTypes.string,
  name: PropTypes.string,
  acceptedFileTypes: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default FilesDropzone;
