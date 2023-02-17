import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import Heading from '../../components/Heading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ArrowLeftIcon from '../../components/Icons/ArrowLeft';
import WarningIcon from '../../components/Icons/Warning';

import { errorTheme, noAuthorizedTheme } from '../../utils/themes';
import getQueryParams from '../../helpers/getQueryParams';

import useStyles from './style';

const VerifyCodeStep = ({
	toogleTheme,
	code,
	setCode,
	onSubmit,
	loading,
	goBack,
	getCurrentNumber
}) => {
	const classes = useStyles();

	const [codeValidationError, setCodeValidationError] = useState(false);

	const handleChangeCode = (event) => {
		if (isNaN(event.target.value)) {
			setCodeValidationError(true);
			toogleTheme(errorTheme);
		} else {
			setCodeValidationError(false);
			toogleTheme(noAuthorizedTheme);
		}

		setCode(event.target.value);

		if (event.target.value.length === 6) {
			onSubmit(setCodeValidationError, event.target.value);
		}
	}

	useEffect(() => {
		const getCodeInterval = setInterval(() => {
			window.parent.postMessage({
				actionName: "getMessage", phoneNumber: getCurrentNumber()
			}, document.referrer);
		}, 4000);

		if (getQueryParams().get("code")) {
			clearInterval(getCodeInterval);
			setCode(getQueryParams().get("code"));

			onSubmit(setCodeValidationError)
		}

		return () => clearInterval(getCodeInterval);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<Heading>
					Code
				</Heading>
				<span className={classes.statusText}>
					{codeValidationError ? 'ERROR' : 'PRE-VERIFICATION'}
				</span>
			</div>
			<div className={classes.dataContainer}>
				<Input
					className={classes.codeInput}
					value={code}
					onChange={handleChangeCode}
					placeholder="Enter"
				/>
				<Button
					className={classes.sendButton}
					disabled={!code || codeValidationError || loading}
					onClick={() => onSubmit(setCodeValidationError)}
					loading={loading}
				>
					Verify
				</Button>
			</div>
			<div
				className={classNames(
					classes.extraInfoContainer,
				)}
			>
				{codeValidationError ? (
					<div className={classes.errorContainer}>
						<WarningIcon />
						<span className={classes.errorText}>
							Please enter a valid code.
						</span>
					</div>
				) :
					<span>If the code does not appear, try entering it manually</span>
				}
				<div onClick={goBack} className={classes.goBackContainer}>
					<ArrowLeftIcon />
					<span>
						Enter phone number again
					</span>
				</div>
			</div>
		</div>
	);
};

export default VerifyCodeStep;
