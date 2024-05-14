import { Button, Drawer, Group, LoadingOverlay, Select, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../../hooks/use-auth";
import { CounterParty } from "../../types/organization";
import { useEffect } from "react";
import CreateContactForm from "./create_contact";
import { notifications } from "@mantine/notifications";

type Props = {
  counterparty?: CounterParty;
  opened: boolean;
  close: () => void;
};

function EditCounterParty({ counterparty, opened, close }: Props) {
  const [creating, { open: create, close: finishCreate }] = useDisclosure();
  const [addingContact, { open: addContact, close: finishAddContact }] = useDisclosure();
  const { api } = useAuth();

  const counterPartyForm = useForm<CounterParty>({
    mode: "uncontrolled",
    validate: zodResolver(CounterParty),
  });

  useEffect(() => {
    if (!counterPartyForm.initialized && counterparty) counterPartyForm.initialize(counterparty);
  }, [counterparty, counterPartyForm.initialize, counterPartyForm.initialized]);

  const handleCounterPartySubmit = async (data: CounterParty) => {
    create();

    const { status } = await api.updateCounterParty({
      body: data,
    });

    if (status === 200) {
      notifications.show({
        title: "Counterparty",
        message: "Counterparty updated.",
      });
      close();
    } else {
      notifications.show({
        color: "red.7",
        title: "Counterparty",
        message: "Failed to update counterparty",
      });
    }

    finishCreate();
  };

  return (
    <Drawer opened={opened} onClose={close} title="Edit Counterparty" position="right" size="lg">
      <form onSubmit={counterPartyForm.onSubmit(handleCounterPartySubmit)}>
        <Group gap={16}>
          <TextInput
            label="Name"
            placeholder="Name"
            size="md"
            key={counterPartyForm.key("name")}
            {...counterPartyForm.getInputProps("name")}
          />

          <Select
            label="Counterparty Type"
            placeholder="Select counterparty type"
            size="md"
            data={["Customer", "Partner", "Reseller", "Supplier", "Vendor", "Employee"]}
            key={counterPartyForm.key("type")}
            {...counterPartyForm.getInputProps("type")}
          />

          <Button type="submit" size="md" disabled={creating}>
            <LoadingOverlay
              visible={creating}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            Save
          </Button>
        </Group>
      </form>

      <CreateContactForm
        counterpartyId={counterparty?.id}
        opened={addingContact}
        open={addContact}
        close={finishAddContact}
      />
    </Drawer>
  );
}

export default EditCounterParty;
