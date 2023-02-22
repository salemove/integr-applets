import { createUseStyles } from "react-jss";
import COLORS from "../../utils/colors";

const useStyles = createUseStyles((theme) => ({
	root: {
		padding: '12px 20px'
	},

	header: {
		display: 'flex',
		justifyContent: 'space-between'
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

	sendButton: {
		marginLeft: '16px'
	},

	codeInput: {
		width: '232px',
		fontSize: '16px',
		padding: '8px'
	},

	extraInfoContainer: {
		color: COLORS.purpleBlack,
		marginTop: '5px',
		display: 'flex',
		flexDirection: 'column',
		fontSize: '12px'
	},

	goBackContainer: {
		marginTop: "3px",
		display: 'flex',
		alignItems: 'center',
		color: COLORS.standratBlue,
		cursor: 'pointer',

		"& span": {
			marginLeft: "5px"
		}
	},

	errorText: {
		color: theme.inputText,
		fontSize: '12px',
		marginLeft: '5px'
	},

	errorContainer: {
		display: 'flex',
		alignItems: 'center'
	},
}));

export default useStyles;
