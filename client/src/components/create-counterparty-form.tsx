import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import type { NewCounterPartyPayload } from "../types/organization";
import CounterPartyForm from "./counterparty/form";

type Props = {
  organizationId: string;
  onCreate: () => void;
};

function CreateCounterPartyForm({ organizationId, onCreate }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();

  const handleSubmit = async (data: NewCounterPartyPayload) => {
    create();
    const { status } = await api.createCounterParty({
      params: {
        organizationId
      },
      body: data,
    });

    if (status === 200) {
      notifications.show({
        title: "Create CounterParty",
        message: "Successfully created counterparty",
      });
      onCreate();
      close();
    } else {
      notifications.show({
        color: "red.7",
        title: "Create CounterParty",
        message: "Error creating counterparty",
      });
    }
    finish();
  };

  return (
    <>
      <CounterPartyForm
        label="Create Counterparty"
        opened={opened}
        close={close}
        creating={creating}
        handleSubmit={handleSubmit}
      />

      <Button bg="blue.6" onClick={open}>
        Create Counterparty
      </Button>
    </>
  );
}

export default CreateCounterPartyForm;
