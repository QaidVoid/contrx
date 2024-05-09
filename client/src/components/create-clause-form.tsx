import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import ClauseForm from "./clause/form";
import type { NewClausePayload } from "../types/clause";

type Props = {
  organizationId: string;
  onCreate: () => void;
};

function CreateClauseForm({ organizationId, onCreate }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
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
      <ClauseForm
        label="Create Clause"
        opened={opened}
        close={close}
        creating={creating}
        handleSubmit={handleSubmit}
      />

      <Button bg="blue.6" onClick={open}>
        Create Clause
      </Button>
    </>
  );
}

export default CreateClauseForm;
