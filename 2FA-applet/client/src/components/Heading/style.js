import { createUseStyles } from "react-jss";

import COLORS from "../../utils/colors";

const useStyles = createUseStyles({
	root: {
		color: COLORS.transparentGrey,
		fontSize: '12px',
		fontWeight: '500',
		margin: 0
	}
});

export default useStyles;
