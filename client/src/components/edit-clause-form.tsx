import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import useAuth from "../hooks/use-auth";
import { type ClauseResponse, NewClausePayload } from "../types/clause";
import { Modal, Group, Select, TextInput, Button, LoadingOverlay } from "@mantine/core";
import TextEditor from "./super-rich-editor";
import { useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const { api } = useAuth();

  if (!clause) return;

  if (!mounted) {
    form.setValues(clause);
    form.resetDirty();
    setMounted(true);
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
    <Modal
      opened={opened}
      onClose={() => {
        setMounted(false);
        close();
      }}
      title="Edit Clause"
      size="lg"
    >
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
          value={form.getValues().language}
          error={form.getInputProps("language").error}
          onChange={(value) => form.setFieldValue("language", value)}
        />

        <Button type="submit" fullWidth mt="xl" size="md" disabled={creating}>
          <LoadingOverlay
            visible={creating}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          Edit
        </Button>
      </form>
    </Modal>
  );
}

export default EditClause;
