import React, { useState, useEffect } from 'react';

import PhoneStep from '../PhoneStep';
import VerifyCodeStep from '../VerifyCodeStep';
import SuccessStep from '../SuccessStep';

import twilioService from '../../services/twilioService';
import { errorTheme, noAuthorizedTheme, successTheme } from '../../utils/themes';
import getQueryParams from '../../helpers/getQueryParams';

import useStyles from './style';

const Steps = ({ toogleTheme }) => {
	const classes = useStyles();

	const [currentStepId, setCurrentStepID] = useState(1);
	const [numberConfig, setNumberConfig] = useState(null);
	const [code, setCode] = useState(getQueryParams().get('code') || "");
	const [phoneNumber, setPhoneNumber] = useState(getQueryParams().get('tel') || "");
	const [currentCountry, setCurrentCountry] = useState("");
	const [loading, setLoading] = useState(false);
	const [phoneValidationError, setPhoneValidationError] = useState(false);

	const getCurrentNumber = () => {
		if (phoneNumber.includes("+")) {
			return phoneNumber;
		}

		return `+${numberConfig.selectedCountryData.dialCode}${phoneNumber}`;
	}

	const onSendNumberSubmit = async () => {
		setLoading(true);

		try {
			const responseData = await twilioService.startVerify(getCurrentNumber(), getQueryParams().get('siteId'));

			if (responseData.success) {
				setCurrentStepID(2);
				setPhoneValidationError(false);
				toogleTheme(noAuthorizedTheme);
				const payload = {
					actionName: "sendSystemMessage",
					messageContent: "2-factor verification requested"
				};

				window.parent.postMessage(payload, document.referrer);
				return;
			}

			setPhoneValidationError(true);
			toogleTheme(errorTheme);
		} catch (error) {
			setPhoneValidationError(true);
			toogleTheme(errorTheme);
			return;
		} finally {
			setLoading(false);
		}
	};


	const onVerifySubmit = async (setError, currentCode) => {
		setLoading(true);

		const payload = {
			actionName: "sendSystemMessage",
			messageContent: "2-factor verification NOT successful"
		};

		try {
			const responseData = await twilioService.checkVerify(getCurrentNumber(), currentCode || code, getQueryParams().get('siteId'));

			if (responseData.success) {
				const payload = { actionName: "verifyVisitor", phoneNumber: getCurrentNumber() };

				setCurrentStepID(3);
				setError(false);
				toogleTheme(successTheme);
				window.parent.postMessage(payload, document.referrer);
				return;
			}

			setError(true);
			toogleTheme(errorTheme);
			window.parent.postMessage(payload, document.referrer);
		} catch (error) {
			setError(true);
			toogleTheme(errorTheme);
			window.parent.postMessage(payload, document.referrer);
		} finally {
			setLoading(false);
		}
	}


	const handlePhoneNumberChange = (event) => {
		let value = phoneNumber;

		if (event) {
			value = event.target.value;
		}

		if (isNaN(value)) {
			setPhoneValidationError(true);
			toogleTheme(errorTheme);
		} else {
			setPhoneValidationError(false);
			toogleTheme(noAuthorizedTheme);
		}

		setPhoneNumber(value);
	}

	const goBack = async () => {
		const payload = {
			actionName: "enterPhoneAgain",
			phoneNumber: getCurrentNumber()
		};

		if (currentStepId === 2) {
			setLoading(true);

			try {
				const responseData = await twilioService.cancelVerify(getCurrentNumber(), getQueryParams().get('siteId'));

				if (responseData.success) {
					window.parent.postMessage(payload, document.referrer);
					setCurrentStepID(1);
					setCode("");
					toogleTheme(noAuthorizedTheme);
					return;
				}

				toogleTheme(errorTheme);
			} catch (error) {
				toogleTheme(errorTheme);
			} finally {
				setLoading(false);
			}

			return;
		}

		window.parent.postMessage(payload, document.referrer);
		setCurrentStepID(1);
		setCode("");
		toogleTheme(noAuthorizedTheme);
	};

	const STEPS = [
		{
			id: 1,
			component: <PhoneStep
				handlePhoneNumberChange={handlePhoneNumberChange}
				onSubmit={onSendNumberSubmit}
				loading={loading}
				setNumberConfig={setNumberConfig}
				phoneValidationError={phoneValidationError}
				phoneNumber={phoneNumber}
			/>
		},
		{
			id: 2,
			component: <VerifyCodeStep
				code={code}
				setCode={setCode}
				loading={loading}
				toogleTheme={toogleTheme}
				onSubmit={onVerifySubmit}
				goBack={goBack}
				getCurrentNumber={getCurrentNumber}
			/>
		},
		{
			id: 3,
			component: <SuccessStep goBack={goBack} toogleTheme={toogleTheme} />
		}
	];

	useEffect(() => {
		if (getQueryParams().get("verified")) {
			setCurrentStepID(3);
		}

		if (getQueryParams().get("code")) {
			setCurrentStepID(2);
		}

		if (phoneNumber && numberConfig) {
			const currentCountryCode = `+${numberConfig.selectedCountryData.dialCode}`;
			const refactoredPhoneNumber = phoneNumber.replace(currentCountryCode, "");

			setPhoneNumber(refactoredPhoneNumber);
			setCurrentCountry(numberConfig.selectedCountryData.iso2);
		}

		if (!numberConfig?.selectedCountryData?.iso2 && currentCountry) {
			numberConfig.setCountry(currentCountry);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [numberConfig, currentStepId]);

	return (
		<div className={classes.root}>
			{STEPS.find((step) => step.id === currentStepId).component}
		</div>
	);
};

export default Steps;
