import React, { useState } from 'react';
import { ThemeProvider } from 'react-jss';

import Steps from './views/Steps';

import { noAuthorizedTheme } from "./utils/themes";

const App = () => {
	const [currentTheme, setCurrentTheme] = useState(noAuthorizedTheme);

	return (
		<ThemeProvider theme={currentTheme}>
			<Steps toogleTheme={setCurrentTheme} />
		</ThemeProvider>
	);
}

export default App;
