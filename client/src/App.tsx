import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import theme from "./theme";
import { AuthProvider } from "./context/auth-context";

function App() {
  return (
    <AuthProvider>
      <MantineProvider withGlobalClasses withCssVariables theme={theme}>
        <Notifications position="top-right" zIndex={1000} />
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;
