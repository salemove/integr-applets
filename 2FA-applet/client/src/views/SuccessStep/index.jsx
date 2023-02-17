import React, { useEffect, useState } from 'react';

import Heading from '../../components/Heading';
import ArrowLeftIcon from '../../components/Icons/ArrowLeft';
import CorrectIcon from '../../components/Icons/Correct';

import { successTheme } from '../../utils/themes';

import useStyles from './style';

const SuccessStep = ({ goBack, toogleTheme }) => {
	const classes = useStyles();

	const [minutes, setMinutes] = useState(30);
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		let myInterval = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}
			if (seconds === 0) {
				if (minutes === 0) {
					clearInterval(myInterval)
				} else {
					setMinutes(minutes - 1);
					setSeconds(59);
				}
			}
		}, 1000);

		if (minutes === 0 && seconds === 0) {
			goBack();
		}

		return () => {
			clearInterval(myInterval);
		};
	});

	useEffect(() => {
		const payload = {
			actionName: "sendSystemMessage",
			messageContent: "2-factor verification verified successfully"
		};

		toogleTheme(successTheme)
		window.parent.postMessage(payload, document.referrer);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<div className={classes.headingContainer}>
					<Heading className={classes.heading}>Verification successful</Heading>
					<CorrectIcon />
				</div>
				<span className={classes.statusText}>
					VERIFIED
				</span>
			</div>
			<div className={classes.extraInfoContainer}>
				<span>
					Next verify in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
				</span>
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

export default SuccessStep;
