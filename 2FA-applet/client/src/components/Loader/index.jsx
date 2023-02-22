import React from 'react';

import LoaderIcon from '../Icons/Loader';

import useStyles from './style';

const Loader = () => {
  const classes = useStyles();

  return (
    <LoaderIcon className={classes.root} />
  );
};

export default Loader;
