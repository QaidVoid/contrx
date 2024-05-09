import { Title, Paper, Text, Group, Grid, Divider } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { OrganizationsResponse } from "../types/organization";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import CreateOrganizationForm from "../components/create-organization-form";

function Application() {
  const [organizations, setOrganizations] = useState<OrganizationsResponse>([]);
  const { api } = useAuth();

  const fetchOrganizations = useCallback(async () => {
    console.log("HELLO")
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
      </Group>

      <Grid mt="md" px="md">
        {organizations.map((organization) => (
          <Grid.Col span={3} key={organization.id}>
            <Paper shadow="sm" p="sm" radius="lg" withBorder>
              <Link to={`/${organization.id}`}>
                <Title order={3} c="blue.8">
                  {organization.name}
                </Title>
              </Link>

              <Divider />

              <Text mt="sm">Country: {organization.country}</Text>
              <Text>Owner: QaidVoid</Text>
              <Text>Created On: May 05, 2024</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
export default Application;
