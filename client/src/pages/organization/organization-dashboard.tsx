import { AppShell, Button, Divider, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  IconFileAnalytics,
  IconUsers,
  IconSettings,
  IconUserBolt,
  IconNotification,
} from "@tabler/icons-react";
import useAuth from "../../hooks/use-auth";
import { LinkGroup } from "../../components/link-group";
import { useCallback, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import UserNotifications from "../../components/notifications";
import type { OrganizationUser } from "../../types/user";
import UserCard from "../../components/user-card";

function OrganizationDashboard() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [isValid, setIsValid] = useState(false);
  const [orgUser, setOrgUser] = useState<OrganizationUser | undefined>(undefined);

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchOrganization = useCallback(async () => {
    const { status } = await api.getOrganization({
      params: {
        organizationId,
      },
    });

    if (status === 200) {
      const { body, status } = await api.getUser({
        params: {
          organizationId,
        },
      });

      if (status === 200) {
        setOrgUser(body);
        setIsValid(true);
      } else {
        notifications.show({
          color: "red",
          message: "Invalid user",
        });
        setIsValid(false);
      }
    } else {
      notifications.show({
        color: "red",
        message: "Invalid organization",
      });
      setIsValid(false);
    }
  }, [organizationId, api.getOrganization, api.getUser]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  if (!isValid) {
    return <div>Invalid organization</div>;
  }

  return (
    <AppShell
      header={{
        height: 60,
      }}
      navbar={{
        breakpoint: "sm",
        width: { base: 200, md: 300 },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text>Logo</Text>
            <Group gap={8}>
              <UserNotifications />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Stack justify="space-between" h="100vh">
          <ScrollArea>
            <Stack gap={20} p="md">
              <LinkGroup
                name="Dashboard"
                links={[
                  {
                    label: "Overview",
                    href: `/${organizationId}/overview`,
                    icon: IconUserBolt,
                  },
                  {
                    label: "Contracts",
                    href: `/${organizationId}/contracts`,
                    icon: IconFileAnalytics,
                  },
                ]}
              />
              {orgUser?.role.toLowerCase() === "admin" ? (
                <LinkGroup
                  name="Organization"
                  links={[
                    {
                      label: "Users",
                      href: `/${organizationId}/users`,
                      icon: IconUsers,
                    },
                    {
                      label: "Counterparties",
                      href: `/${organizationId}/counterparties`,
                      icon: IconSettings,
                    },
                    {
                      label: "Clauses",
                      href: `/${organizationId}/clauses`,
                      icon: IconNotification,
                    },
                    {
                      label: "Contract Types",
                      href: `/${organizationId}/contract-types`,
                      icon: IconFileAnalytics,
                    },
                  ]}
                />
              ) : undefined}
            </Stack>
          </ScrollArea>

          <Stack gap={0}>
            <Divider />
            <UserCard />
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default OrganizationDashboard;
