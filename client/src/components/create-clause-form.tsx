import { Button, Group, LoadingOverlay, Modal, Select, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import { NewClausePayload } from "../types/clause";
import TextEditor from "./super-rich-editor";

type Props = {
  organizationId: string;
  onCreate: () => void;
};

function CreateClauseForm({ organizationId, onCreate }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const form = useForm<NewClausePayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewClausePayload),
  });
  const { api } = useAuth();

  const handleSubmit = async (data: NewClausePayload) => {
    create();
    const { status } = await api.createClause({
      body: {
        ...data,
        organization_id: organizationId,
        is_default: false,
      },
    });

    if (status === 200) {
      notifications.show({
        title: "Create Clause",
        message: "Successfully created clause",
      });
      onCreate();
      close();
    } else {
      notifications.show({
        color: "red.7",
        title: "Create Clause",
        message: "Error creating clause",
      });
    }
    finish();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Clause" size="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group grow>
            <Select
              label="Clause Type"
              placeholder="Select clause type"
              size="md"
              data={["Amendment", "Assignment", "Benefits", "Compliance"]}
              key={form.key("type")}
              {...form.getInputProps("type")}
            />

            <TextInput
              label="Clause Name"
              placeholder="Clause name"
              size="md"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          </Group>

          <TextInput
            label="Clause Title"
            placeholder="Clause title"
            mt="md"
            size="md"
            key={form.key("title")}
            {...form.getInputProps("title")}
          />

          <TextEditor
            value={form.values.language}
            error={form.getInputProps("language").error}
            onChange={(value) => form.setFieldValue("language", value)}
          />

          <Button type="submit" fullWidth mt="xl" size="md" disabled={creating}>
            <LoadingOverlay
              visible={creating}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            Create Clause
          </Button>
        </form>
      </Modal>

      <Button bg="blue.6" onClick={open}>
        Create Clause
      </Button>
    </>
  );
}

export default CreateClauseForm;
