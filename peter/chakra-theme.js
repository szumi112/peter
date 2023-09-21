// chakra-theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light", // Default color mode is light
    useSystemColorMode: false, // Disable using system preferences
  },
  colors: {
    light: {
      primary: "blue.500",
      background: "white",
      text: "black",
    },
    dark: {
      primary: "teal.300",
      background: "gray.800",
      text: "white",
    },
  },
});

export default theme;
