import { Card, Flex, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import TitleBar from "../../components/title-bar";

function OrganizationUsers() {
  return (
    <>
      <TitleBar title="Organization Users" />
      <Group p="md" grow>
        <Grid columns={3}>
          <Card withBorder p="xl" radius="md">
            <Grid>
              <Grid.Col span={4}>
                Profile Image
              </Grid.Col>

              <Grid.Col span={8}>
                <Stack gap={2}>
                  <Text>Name</Text>
                  <Text>Email</Text>
                  <Text>Active</Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid>
      </Group>
    </>
  )
}

export default OrganizationUsers;
