import { Button, LoadingOverlay, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { InviteUser } from "../types/user";

type Props = {
  organizationId: string;
};

function InviteUserForm({ organizationId }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const { api } = useAuth();

  const form = useForm<InviteUser>({
    mode: "uncontrolled",
    validate: zodResolver(InviteUser),
  });

  const handleSubmit = async (data: InviteUser) => {
    create();
    const { body, status } = await api.inviteOrganizationUser({
      params: {
        organizationId,
      },
      body: data,
    });

    if (status === 200) {
      notifications.show({
        title: "Invite User",
        message: "User invited successfully",
      });
      close();
    } else if (status === 422) {
      for (const error of body.errors) {
        notifications.show({
          color: "red.7",
          title: "Invite user",
          message: error.message,
        });
      }
    } else {
      notifications.show({
        color: "red.7",
        title: "Invite user",
        message: "Failed to invite user",
      });
    }
    finish();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Invite User" size="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={16}>
            <Select
              label="Role"
              placeholder="Select user role"
              size="md"
              data={["Admin", "Member"]}
              key={form.key("role")}
              {...form.getInputProps("role")}
            />

            <TextInput
              label="Email"
              placeholder="Email"
              size="md"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <Button type="submit" size="md" disabled={creating}>
              <LoadingOverlay
                visible={creating}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              Invite
            </Button>
          </Stack>
        </form>
      </Modal>

      <Button bg="blue.6" onClick={open}>
        Invite User
      </Button>
    </>
  );
}

export default InviteUserForm;
