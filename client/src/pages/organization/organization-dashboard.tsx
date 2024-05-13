import { AppShell, Button, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { IconFileAnalytics, IconNotification, IconTemplate, IconFlower, IconFileArrowLeft, IconListTree, IconUsers, IconSettings, IconUserBolt } from "@tabler/icons-react";
import useAuth from "../../hooks/use-auth";
import { LinkGroup } from "../../components/link-group";
import { useCallback, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

function OrganizationDashboard() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [isValid, setIsValid] = useState(false);

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchOrganization = useCallback(async () => {
    const {status} = await api.getOrganization({
      params: {
        organizationId
      }
    });

    if (status === 200) {
      setIsValid(true);
    } else {
      notifications.show({
        color: "red",
        message: "Invalid organization"
      })
      setIsValid(false);
    }
  }, [organizationId, api.getOrganization]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  if (!isValid) {
    return <div>Invalid organization</div>
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
                  href: `/${organizationId}/contracts`,
                  icon: IconFileAnalytics,
                },
                {
                  label: "Notifications",
                  href: "/notifications",
                  icon: IconNotification
                }
              ]}
            />
            <LinkGroup
              name="Organization"
              links={[
                {
                  label: "Users",
                  href: `/${organizationId}/users`,
                  icon: IconUsers,
                },
                {
                  label: "CounterParties",
                  href: `/${organizationId}/counterparties`,
                  icon: IconSettings
                },
                {
                  label: "Clauses",
                  href: `/${organizationId}/clauses`,
                  icon: IconNotification
                },
                {
                  label: "Contract Types",
                  href: `/${organizationId}/contract-types`,
                  icon: IconFileAnalytics
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

export default OrganizationDashboard;
