import React from 'react';
import classNames from 'classnames';

import Loader from '../Loader';

import useStyles from './style';

const Button = ({ children, className, loading, ...props }) => {
	const classes = useStyles();

	return (
		<button className={classNames(classes.root, className, { loading: loading })} {...props}>
			{loading ? <Loader /> : children}
		</button>
	);
};

export default Button;
