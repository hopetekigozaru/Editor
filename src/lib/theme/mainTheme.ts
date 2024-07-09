import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    accent: {
      main: string;
    };
  }
  interface PaletteOptions {
    accent?: {
      main?: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

// theme.js
const colors = {
  primary: '#0B666A', // Tailwind CSS と MUI の primary カラー
  secondary: '#35A29F', // Tailwind CSS と MUI の secondary カラー
  primaryDark:'#0B666A',
  secondaryDark:'#35A29F',
  accent: '#071952'
};

export const tailwindTheme = {
  extend: {
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent
    },
  },
};


export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    accent: {
      main: colors.accent,
    },
    background: {
      default: '#EEEEEE',
    },
  },
  typography: {},
  components: {
    MuiButton: {
      variants: [
        {
          props: { color: 'accent', variant: 'contained' },
          style: {
            backgroundColor: colors.accent,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: colors.accent,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            opacity: 0.8,
          },
        },
      },
    },
  },
});


export default colors;
