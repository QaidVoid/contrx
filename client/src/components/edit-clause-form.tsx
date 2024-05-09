import { Button, LoadingOverlay, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import useAuth from "../hooks/use-auth";
import { type ClauseResponse, NewClausePayload } from "../types/clause";

type Props = {
  onEdit: () => void;
  clause: ClauseResponse | undefined;
  opened: boolean;
  close: () => void;
};

function EditClause({ onEdit, clause, opened, close }: Props) {
  const form = useForm<NewClausePayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewClausePayload),
  });
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();

  if (!clause) return;

  if (!form.initialized) {
    form.initialize(clause);
  }

  const handleSubmit = async (data: NewClausePayload) => {
    create();
    const { status } = await api.updateClause({
      body: {
        id: clause.id,
        ...data,
      },
    });

    if (status === 200) {
      notifications.show({
        title: "Edit Clause",
        message: "Clause edited successfully",
      });
      onEdit();
      close();
    } else {
      notifications.show({
        color: "red",
        title: "Edit clause",
        message: "Failed to edit clause",
      });
    }

    finish();
  };

  return (
    <Modal opened={opened} onClose={close} title="Edit Organization">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Clause Type"
          placeholder="Select clause type"
          size="md"
          data={["Amendment", "Assignment", "Benefits", "Compliance"]}
          key={form.key("type")}
          {...form.getInputProps("type")}
        />
        <TextInput
          label="Clause Title"
          placeholder="Clause title"
          mt="md"
          size="md"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />
        <TextInput
          label="Clause Name"
          placeholder="Clause name"
          mt="md"
          size="md"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Language"
          placeholder="Clause Language"
          mt="md"
          size="md"
          key={form.key("language")}
          {...form.getInputProps("language")}
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

export default EditClause;
