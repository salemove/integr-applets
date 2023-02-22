import { createUseStyles } from "react-jss";

import COLORS from "../../utils/colors";

const useStyles = createUseStyles({
	root: {
		color: COLORS.white,
		fontSize: '14px',
		padding: '8px 16px',
		backgroundColor: COLORS.blueDefault,
		borderRadius: '4px',
		height: '32px',
		border: 'none',
		cursor: 'pointer',
		minWidth: '80px',
		fontWeight: '500',

		"&:hover": {
			backgroundColor: COLORS.blueLight
		},

		'&:disabled': {
			cursor: 'not-allowed',
			backgroundColor: COLORS.simpleGrey,
			color: COLORS.standartGrey,
			border: `1px solid ${COLORS.shadowGrey}`,
			userSelect: 'none',

			"&.loading": {
				padding: '6px 16px',
			}
		},

		"&:active:enabled": {
			backgroundColor: COLORS.blueDark
		}
	}
});

export default useStyles;
