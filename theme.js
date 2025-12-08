import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			// main: '#e6e0e0',
			main: '#38bbcd',
		},
		secondary: {
			main: '#db6273',
		},
	},
	typography: {
		fontSize: 14,
	},
  // MUIの新しいバージョン対応
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 必要に応じて
        },
      },
    },
  },
});

export default theme;
