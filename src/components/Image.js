import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  image: {
    objectFit: 'contain',
    maxWidth: '100%'
  }
}));

const Image = ({ src, alt = 'Safaricom Image', className }) => {
  const classes = useStyles();
  return (
    <img src={src} className={clsx(classes.image, className || '')} alt={alt} />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired
};

export default Image;
