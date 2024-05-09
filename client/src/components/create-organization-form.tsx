import { TextInput, Select, Button, LoadingOverlay, Modal } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import useAuth from "../hooks/use-auth";
import { OrganizationPayload } from "../types/organization";
import countries from "../lib/countries";

type Props = {
  onCreate: () => void;
};

function CreateOrganizationForm({ onCreate }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<OrganizationPayload>({
    mode: "uncontrolled",
    validate: zodResolver(OrganizationPayload),
  });
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();

  const handleSubmit = async (data: OrganizationPayload) => {
    create();
    const { status } = await api.createOrganization({ body: data });

    if (status === 200) {
      notifications.show({
        title: "Create Organization",
        message: "Successfully created organization"
      })
      onCreate();
      close();
    } else {
      notifications.show({
        color: "red.7",
        title: "Create Organization",
        message: "Failed to create organization",
      });
    }
    finish();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Organization">
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
      </Modal>

      <Button bg="blue.6" onClick={open}>
        Create Organization
      </Button>
    </>
  );
}

export default CreateOrganizationForm;
