import { createUseStyles } from "react-jss";

import COLORS from "../../utils/colors";

const useStyles = createUseStyles((theme) => ({
    input: {
        padding: '8px',
        border: theme.border,
        borderRadius: '4px',
        height: '32px',
        fontSize: '14px',
        color: COLORS.purpleBlack,
        boxSizing: 'border-box',

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
