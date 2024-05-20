import { Button, LoadingOverlay, Modal, Select, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { type NewOrganizationResponse, OrganizationPayload } from "../types/organization";
import countries from "../lib/countries";
import useAuth from "../hooks/use-auth";

type Props = {
  onEdit: () => void;
  organization: NewOrganizationResponse | undefined;
  opened: boolean;
  close: () => void;
};

function EditOrganization({ onEdit, organization, opened, close }: Props) {
  const form = useForm<OrganizationPayload>({
    mode: "uncontrolled",
    validate: zodResolver(OrganizationPayload),
  });
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();

  if (!organization) return;

  const handleSubmit = async (data: OrganizationPayload) => {
    create();
    const { status } = await api.updateOrganization({
      body: {
        id: organization.id,
        ...data,
      },
    });

    if (status === 200) {
      notifications.show({
        title: "Edit Organization",
        message: "Organization edited successfully",
      });
      onEdit();
      close();
    } else {
      notifications.show({
        color: "red",
        title: "Edit organization",
        message: "Failed to edit organization",
      });
    }

    finish();
  };

  form.initialize(organization);

  return (
    <Modal opened={opened} onClose={close} title="Edit Organization">
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
    </Modal>
  );
}

export default EditOrganization;
