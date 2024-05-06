import { Title, Paper, Text, Group, Anchor, Grid } from "@mantine/core";
import { Link } from "react-router-dom";

function Application() {
  const organizationId = 1;

  return (
    <>
      <Group justify="space-between">
        <Title order={2} c="gray.8" mt="lg" mb="xl">
          My Organizations
        </Title>
        <Link to="/setup/org">
          Create Organization
        </Link>
      </Group>

      <Grid>
        <Grid.Col span={3}>
          <Paper shadow="sm" p="sm" radius="lg" withBorder>
            <Link to={`/${organizationId}`}>
              <Title order={3} mt="lg" c="blue.8">
                Organization name
              </Title>
            </Link>

            <Text mt="sm">Owner: QaidVoid</Text>
            <Text>Created On: May 05, 2024</Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}
export default Application;
