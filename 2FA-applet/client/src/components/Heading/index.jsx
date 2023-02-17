import React from 'react';
import classNames from 'classnames';

import useStyles from './style';

const Heading = ({ children, className, ...props }) => {
	const classes = useStyles();

	return (
		<h6 className={classNames(classes.root, className)} {...props}>
			{children}
		</h6>
	);
};

export default Heading;
