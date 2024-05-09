import { Modal, Group, Select, TextInput, Button, LoadingOverlay } from "@mantine/core";
import TextEditor from "../super-rich-editor";
import { useForm, zodResolver } from "@mantine/form";
import { NewClausePayload } from "../../types/clause";

type Props = {
  opened: boolean;
  close: () => void;
  creating: boolean;
  handleSubmit: (data: NewClausePayload) => void;
  label: string;
};

function ClauseForm({ opened, creating, handleSubmit, label, close }: Props) {
  const form = useForm<NewClausePayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewClausePayload),
  });

  return (
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
          {label}
        </Button>
      </form>
    </Modal>
  );
}

export default ClauseForm;
