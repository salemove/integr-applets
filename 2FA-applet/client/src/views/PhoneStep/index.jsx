import React, { useCallback, useEffect } from 'react';

import Heading from '../../components/Heading';
import Button from '../../components/Button';
import WarningIcon from '../../components/Icons/Warning';
import intlTelInput from 'intl-tel-input';

import useStyles from './style';

const PhoneStep = ({
	onSubmit,
	loading,
	setNumberConfig,
	phoneNumber,
	handlePhoneNumberChange,
	phoneValidationError
}) => {
	const classes = useStyles();

	const countryChangeListener = useCallback(() => {
		handlePhoneNumberChange();
	}, [handlePhoneNumberChange]);

	useEffect(() => {
		const inputElem = document.querySelector("#phone");
		const iti = intlTelInput(inputElem, {
			initialCountry: "us"
		});

		setNumberConfig(iti);

		inputElem.addEventListener("countrychange", countryChangeListener);

		return () => {
			inputElem.removeEventListener("countrychange", countryChangeListener);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	useEffect(() => {
		const inputElem = document.querySelector("#phone");

		inputElem.addEventListener("countrychange", countryChangeListener);

		return () => {
			inputElem.removeEventListener("countrychange", countryChangeListener);
		}

	}, [countryChangeListener]);

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<Heading>
					Phone number
				</Heading>
				<span className={classes.statusText}>
					{phoneValidationError ? 'ERROR' : 'PRE-VERIFICATION'}
				</span>
			</div>
			<div className={classes.dataContainer}>
				<div>
					<input
						id="phone"
						onChange={handlePhoneNumberChange}
						placeholder="Enter"
						type="tel"
						className={classes.phoneInput}
						value={phoneNumber}
					/>
					{phoneValidationError && (
						<div className={classes.errorContainer}>
							<WarningIcon />
							<span className={classes.errorText}>
								Please enter a valid phone number.
							</span>
						</div>
					)}
				</div>
				<Button
					disabled={!phoneNumber || phoneValidationError || loading}
					onClick={onSubmit}
					loading={loading}
				>
					Send Code
				</Button>
			</div>
		</div >
	);
};

export default PhoneStep;
