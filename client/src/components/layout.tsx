import { AppShell, Button, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";
import { LinkGroup } from "./link-group";
import { IconUserBolt, IconMail, IconLock, IconFileAnalytics, IconNotification } from "@tabler/icons-react";

function Layout() {
  const { api } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{
        height: 60,
      }}
      navbar={{
        breakpoint: "sm",
        width: { base: 200, md: 300 },
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

      <AppShell.Navbar p="md">
        <ScrollArea>
          <Stack p={4} gap={20}>
            <LinkGroup
              name="Dashboard"
              links={[
                {
                  label: "Overview",
                  href: "/overview",
                  icon: IconUserBolt
                },
                {
                  label: "Contracts",
                  href: "/contracts",
                  icon: IconFileAnalytics,
                },
                {
                  label: "Notifications",
                  href: "/notifications",
                  icon: IconNotification
                }
              ]}
            />
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
