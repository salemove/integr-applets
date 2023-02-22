import COLORS from "./colors";

export const noAuthorizedTheme = {
	statusColor: COLORS.redDark,
	backgroundColor: COLORS.redTransparent,
	inputText: COLORS.purpleBlack,
	border: `1px solid ${COLORS.standartGrey}`
};

export const errorTheme = {
	statusColor: COLORS.redDark,
	backgroundColor: COLORS.redTransparent,
	inputText: COLORS.lightRed,
	border: `1px solid ${COLORS.redDefault}`
};

export const successTheme = {
	statusColor: COLORS.greenDrak,
	backgroundColor: COLORS.greenTransparent,
	inputText: COLORS.lightRed,
	border: `1px solid ${COLORS.standartGrey}`
};
