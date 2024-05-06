import { AppShell, Button, Group, Text } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";

function Layout() {
  const { api } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{
        height: 60,
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text>Logo</Text>
            <Group gap={8}>
              <Button
                onClick={async () => {
                  await api.logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
