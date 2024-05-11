import {
  Button,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { NewContractPayload } from "../types/contract";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import type { ContractType } from "../types/contract-type";

function CreateContractForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const form = useForm<NewContractPayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewContractPayload),
  });
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const { api } = useAuth();

  const handleSubmit = async (data: NewContractPayload) => {
    create();
    const { body, status } = await api.createContract({
      body: data,
    });

    if (status === 200) {
      notifications.show({
        title: "Create Contract",
        message: "Successfully created contract",
      });
      console.log("RESPONSE", body);
    } else {
      notifications.show({
        color: "red.7",
        title: "Create Contract",
        message: "Error creating contract",
      });
    }
    finish();
  };

  const fetchContractTypes = useCallback(async () => {
    const { body, status } = await api.getTemplates({
      query: {
        page: 1,
        size: 100,
      },
    });

    if (status === 200) {
      setContractTypes(body.data);
    } else {
      notifications.show({
        color: "red.7",
        title: "Contract",
        message: "Error fetching contract types",
      });
    }
  }, [api.getTemplates]);

  useEffect(() => {
    fetchContractTypes();
  }, [fetchContractTypes]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Contract">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={16}>
            <Select
              label="Contract Type"
              placeholder="Select contract type"
              size="md"
              data={contractTypes.map((c) => ({ value: c.id, label: c.name }))}
              key={form.key("contract_type")}
              {...form.getInputProps("contract_type")}
            />
            <TextInput
              label="Contract Title"
              placeholder="Contract title"
              size="md"
              key={form.key("title")}
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Description"
              placeholder="Contract Description"
              size="md"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
            <DateInput
              label="Effective Date"
              placeholder="Pick contract effective date"
              size="md"
              key={form.key("effective_date")}
              {...form.getInputProps("effective_date")}
            />
            <DateInput
              label="Expiry Date"
              placeholder="Pick contract expiry date"
              size="md"
              key={form.key("expiry_date")}
              {...form.getInputProps("expiry_date")}
            />
            <Select
              searchable
              label="Counterparty"
              placeholder="Select"
              size="md"
              data={["Me", "You"]}
              key={form.key("counterparty")}
              {...form.getInputProps("counterparty")}
            />
            <Button type="submit" fullWidth size="md" disabled={creating}>
              <LoadingOverlay
                visible={creating}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              Create Contract
            </Button>
          </Stack>
        </form>
      </Modal>

      <Button onClick={open}>Create</Button>
    </>
  );
}

export default CreateContractForm;
