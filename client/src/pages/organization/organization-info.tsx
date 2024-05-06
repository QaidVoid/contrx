import { Button, Group, LoadingOverlay, Select, TextInput } from "@mantine/core";
import TitleBar from "../../components/title-bar";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import useAuth from "../../hooks/use-auth";
import { useParams } from "react-router-dom";
import countries from "../../lib/countries";
import { OrganizationPayload } from "../../types/organization";
import { notifications } from "@mantine/notifications";

function OrganizationInfo() {
  const form = useForm<OrganizationPayload>({
    mode: "uncontrolled",
    validate: zodResolver(OrganizationPayload)
  });
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();
  const params = useParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchData = useCallback(async () => {
    const { body, status } = await api.getOrganization({
      params: {
        organizationId
      }
    })

    if (status === 200) {
      form.setFieldValue("name", body.name);
      form.setFieldValue("country", body.country);
    }
  }, [organizationId]);

  useEffect(() => () => {
    fetchData();
  }, []);

  const handleSubmit = async (data: OrganizationPayload) => {
    create();
    const { status } = await api.updateOrganization({
      body: {
        id: organizationId,
        ...data
      }
    });

    if (status !== 200) {
      notifications.show({
        color: "red",
        title: "Update organization",
        message: "Failed to update organization"
      })
    }

    finish();
  }

  return (
    <>
      <TitleBar title="Organization Info" />
      <Group p="md" grow maw="600px">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Organization Name"
            placeholder="Organization name"
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
      </Group>
    </>
  )
}

export default OrganizationInfo;
