import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    dark: {
      primary: "teal.300",
      secondary: "teal.500",
      background: "gray.800",
      text: "white",
      vStackBackground: "gray.100",
    },
    light: {
      primary: "blue.500",
      background: "red",
      text: "yellow",
    },
  },
});

export default theme;
