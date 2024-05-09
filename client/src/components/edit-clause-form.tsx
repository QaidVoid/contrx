import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import useAuth from "../hooks/use-auth";
import { type ClauseResponse, NewClausePayload } from "../types/clause";
import ClauseForm from "./clause/form";

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
    <ClauseForm
      label="Edit Clause"
      opened={opened}
      close={close}
      creating={creating}
      handleSubmit={handleSubmit}
    />
  );
}

export default EditClause;
