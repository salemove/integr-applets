import React from 'react';
import classNames from 'classnames';

import useStyles from './style';

const Input = ({ className, ...props }) => {
    const classes = useStyles();

    return (
        <input
            className={classNames(classes.input, className)}
            {...props}
        />
    );
}

export default Input;
