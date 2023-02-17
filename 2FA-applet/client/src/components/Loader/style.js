import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
	root: {
		animation: "$rotation 2s infinite linear"
	},

	"@keyframes rotation": {
		from: {
			transform: "rotate(0deg)"
		},
  	to: {
			transform: "rotate(359deg)"
		}
	}
});

export default useStyles;
