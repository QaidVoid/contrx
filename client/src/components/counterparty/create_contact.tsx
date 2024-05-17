import { TextInput, Button, Group, ActionIcon, Box, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ContactsListForm } from "../../types/organization";
import { randomId, useDisclosure } from "@mantine/hooks";
import useAuth from "../../hooks/use-auth";
import { useCallback, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";

type Props = {
  counterpartyId: string;
};

function CreateContactForm({ counterpartyId }: Props) {
  const [creating, { open: create, close: finish }] = useDisclosure();
  const { api } = useAuth();

  const form = useForm<ContactsListForm>({
    validate: zodResolver(ContactsListForm),
    initialValues: {
      contacts: [{ full_name: "", email: "", key: randomId() }],
    },
  });

  const fetchContacts = useCallback(async () => {
    const { body, status } = await api.getContacts({
      params: {
        counterpartyId,
      },
    });

    if (status === 200) {
      form.initialize({
        contacts: body.map((b) => ({ ...b, key: randomId() })),
      });
    }
  }, [api.getContacts, counterpartyId, form.initialize]);

  const handleSubmit = useCallback(
    async (data: ContactsListForm) => {
      create();

      const { status } = await api.createContact({
        params: {
          counterpartyId,
        },
        body: data.contacts,
      });

      if (status === 200) {
        notifications.show({
          title: "Contact",
          message: "Contact(s) updated successfully.",
        });
        await fetchContacts();
      }

      finish();
    },
    [counterpartyId, api.createContact, create, finish, fetchContacts],
  );

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const fields = form.getValues().contacts.map((item, index) => (
    <Group key={item.key} mt="xs" maw={600} justify="space-between" align="start">
      <TextInput
        placeholder="Full Name"
        style={{ flex: 1 }}
        size="sm"
        key={form.key(`contacts.${index}.full_name`)}
        {...form.getInputProps(`contacts.${index}.full_name`)}
      />

      <TextInput
        type="email"
        placeholder="Email"
        style={{ flex: 1 }}
        size="sm"
        key={form.key(`contacts.${index}.email`)}
        {...form.getInputProps(`contacts.${index}.email`)}
      />

      <ActionIcon color="red" onClick={() => form.removeListItem("contacts", index)}>
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  console.log(form.getValues());

  return (
    <>
      <Box maw={600} mx="auto" mt="md">
        {fields.length > 0 ? (
          <Group mb="xs" maw={550}>
            <Text fw={500} size="sm" style={{ flex: 1 }}>
              Full Name
            </Text>

            <Text fw={500} size="sm" style={{ flex: 1 }}>
              Email
            </Text>
          </Group>
        ) : (
          <Text c="dimmed" ta="center">
            Sed, no one here...
          </Text>
        )}

        {fields}

        <Group justify="center" mt="md">
          <Button
            onClick={() =>
              form.insertListItem("contacts", { full_name: "", email: "", key: randomId() })
            }
          >
            Add contact
          </Button>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Button
              type="submit"
              disabled={form.getValues().contacts.some((c) => c.email === "" || c.full_name === "")}
            >
              Submit
            </Button>
          </form>
        </Group>
      </Box>
    </>
  );
}

export default CreateContactForm;
