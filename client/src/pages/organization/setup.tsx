import { Group, Paper, Title, Text, TextInput, Select, Button, LoadingOverlay } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../../hooks/use-auth";
import { OrganizationPayload } from "../../types/organization";
import countries from "../../lib/countries";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function SetupOrganization() {
  const form = useForm<OrganizationPayload>({
    mode: "uncontrolled",
    validate: zodResolver(OrganizationPayload),
  });
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: OrganizationPayload) => {
    create();
    const { body, status } = await api.createOrganization({ body: data });

    if (status === 200) {
      navigate(`/${body.id}/info`);
    } else {
      notifications.show({
        color: "red",
        title: "Create Organization",
        message: "Failed to create organization"
      })
    }
    finish();
  };

  return (
    <Group h="100vh" justify="center" align="center">
      <Paper w="90%" maw="600px">
        <Title c="blue.8" order={2} ta="center" mt="md" mb={20}>
          Hello
          <Text c="gray.8">Start using Contrx by creating your organization.</Text>
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Organization Name"
            placeholder="Your organization name"
            size="md"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <Select
            searchable
            label="Country"
            placeholder="Select organization country"
            mt="md"
            size="md"
            data={countries}
            key={form.key("country")}
            {...form.getInputProps("country")}
          />
          <Button type="submit" fullWidth mt="xl" size="md" disabled={creating}>
            <LoadingOverlay
              visible={creating}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            Save
          </Button>
        </form>
      </Paper>
    </Group>
  );
}

export default SetupOrganization;
