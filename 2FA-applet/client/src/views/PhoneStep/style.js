import { createUseStyles } from "react-jss";

import COLORS from "../../utils/colors";

const useStyles = createUseStyles((theme) => ({
	root: {
		padding: '12px 20px'
	},

	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},

	statusText: {
		color: theme.statusColor,
		backgroundColor: theme.backgroundColor,
		fontSize: '12px',
		padding: '4px 8px',
		borderRadius: '4px',
		fontWeight: '500'
	},

	dataContainer: {
		display: 'flex',
		marginTop: '-2px'
	},

	errorText: {
		color: COLORS.redDefault,
		fontSize: '12px',
		marginLeft: '5px'
	},

	errorContainer: {
		marginTop: '4px',
		display: 'flex',
		alignItems: 'center'
	},

	phoneInput: {
		padding: '9px 13px 8px 52px',
		width: '232px',
		height: '32px',
		fontSize: '16px',
		border: theme.border,
		borderRadius: '4px',
		color: COLORS.purpleBlack,
		marginRight: '16px !important',

		'&:placeholder': {
			color: COLORS.transparentGrey,
			fontSize: '16px'
		},

		"&:focus-visible": {
			outline: `1px solid ${COLORS.blueDefault}`,

			'&:placeholder': {
				color: COLORS.standartGrey,
				fontSize: '16px'
			},
		}
	}
}));

export default useStyles;
