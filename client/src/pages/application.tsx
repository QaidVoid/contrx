import { Title, Text, Group, Divider, SimpleGrid, Card, Button, Menu } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { NewOrganizationResponse, OrganizationsResponse } from "../types/organization";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import CreateOrganizationForm from "../components/create-organization-form";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import EditOrganization from "../components/edit-organization-form";

function Application() {
  const [organizations, setOrganizations] = useState<OrganizationsResponse>([]);
  const [organization, setOrganization] = useState<NewOrganizationResponse | undefined>();
  const { api } = useAuth();

  const fetchOrganizations = useCallback(async () => {
    const { body, status } = await api.getMyOrganizations();

    if (status === 200) {
      setOrganizations(body);
    } else {
      notifications.show({
        color: "red",
        message: "Failed to fetch organizations",
      });
    }
  }, [api.getMyOrganizations]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return (
    <>
      <Group bg="green.6" p={18} justify="space-between">
        <Text c="white">My Organizations</Text>
        <CreateOrganizationForm onCreate={fetchOrganizations} />

        <EditOrganization
          onEdit={fetchOrganizations}
          opened={Boolean(organization)}
          organization={organization}
          close={() => setOrganization(undefined)}
        />
      </Group>

      <SimpleGrid cols={4} spacing="md" mt="md">
        {organizations.map((organization) => (
          <Card key={organization.id} withBorder radius="md" shadow="sm">
            <Link to={`/${organization.id}`}>
              <Title order={3} c="blue.8">
                {organization.name}
              </Title>
            </Link>

            <Card.Section>
              <Divider />
            </Card.Section>

            <Text my="sm">Country: {organization.country}</Text>

            <Card.Section>
              <Divider />
            </Card.Section>

            <Card.Section p="sm">
              <Menu shadow="md">
                <Menu.Target>
                  <Button>
                    <IconSettings /> Manage
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconSettings />}
                    onClick={() => setOrganization(organization)}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item leftSection={<IconTrash style={{ color: "red.5" }} />}>
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Card.Section>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
export default Application;
