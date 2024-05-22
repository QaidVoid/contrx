import { AppShell, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/use-auth";
import { IconInfoSquare, IconShield } from "@tabler/icons-react";
import { LinkGroup } from "../../components/link-group";
import UserNotifications from "../../components/notifications";
import UserCard from "../../components/user-card";

function Profile() {
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
        <ScrollArea>
          <Stack gap={20} p="md">
            <LinkGroup
              name="Profile"
              links={[
                {
                  label: "Personal Information",
                  href: "/profile/personal-info",
                  icon: IconInfoSquare
                },
                {
                  label: "Privacy & Security",
                  href: "/profile/security",
                  icon: IconShield
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

export default Profile;

