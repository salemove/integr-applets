import { createUseStyles } from "react-jss";
import COLORS from "../../utils/colors";

const useStyles = createUseStyles((theme) => ({
	root: {
		padding: '16px 20px'
	},

	header: {
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: '4px'
	},

	statusText: {
		color: theme.statusColor,
		backgroundColor: theme.backgroundColor,
		fontSize: '12px',
		padding: '4px 8px',
		borderRadius: '4px',
		fontWeight: '500'
	},

	extraInfoContainer: {
		color: COLORS.transparentGrey,
		marginTop: '12px',
		display: 'flex',
		flexDirection: 'column',
		fontSize: '12px'
	},

	goBackContainer: {
		marginTop: "18px",
		display: 'flex',
		alignItems: 'center',
		color: COLORS.standratBlue,
		cursor: 'pointer',

		"& span": {
			marginLeft: '6px'
		}
	},

	headingContainer: {
		display: 'flex',
		alignItems: 'center'
	},

	heading: {
		fontSize: '16px',
		color: COLORS.greenDrak,
		marginRight: '10px'
	}
}));

export default useStyles;
