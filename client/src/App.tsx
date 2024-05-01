import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import theme from "./theme";

function App() {
  return (
    <MantineProvider withGlobalClasses withCssVariables theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
