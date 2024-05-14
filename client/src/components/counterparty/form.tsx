import { Modal, Select, TextInput, Button, LoadingOverlay, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NewCounterPartyPayload } from "../../types/organization";

type Props = {
  opened: boolean;
  close: () => void;
  creating: boolean;
  handleSubmit: (data: NewCounterPartyPayload) => void;
  label: string;
};

function CounterPartyForm({ opened, creating, handleSubmit, label, close }: Props) {
  const form = useForm<NewCounterPartyPayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewCounterPartyPayload),
  });

  return (
    <Modal opened={opened} onClose={close} title="Create Counterparty" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={16}>
          <TextInput
            label="Name"
            placeholder="Name"
            size="md"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />

          <Select
            label="Counterparty Type"
            placeholder="Select counterparty type"
            size="md"
            data={["Customer", "Partner", "Reseller", "Supplier", "Vendor", "Employee"]}
            key={form.key("type")}
            {...form.getInputProps("type")}
          />

          <Button type="submit" fullWidth size="md" disabled={creating}>
            <LoadingOverlay
              visible={creating}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            {label}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default CounterPartyForm;
