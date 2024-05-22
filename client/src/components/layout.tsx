import { AppShell, Button, Group, Text } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";
import UserNotifications from "./notifications";
import UserCard from "./user-card";

function Layout() {
  const { api } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{
        height: 80,
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text>Logo</Text>
            <Group gap={8}>
              <UserNotifications />

              <UserCard />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>

      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
