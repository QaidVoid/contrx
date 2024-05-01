import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import theme from "./theme";

function App() {
  return (
    <MantineProvider withGlobalClasses withCssVariables theme={theme}>
      <Notifications position="top-right" zIndex={1000} />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
