import { Button, LoadingOverlay, Modal, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { NewContractForm } from "../types/contract";
import useAuth from "../hooks/use-auth";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import type { ContractType } from "../types/contract-type";
import type { CounterParty } from "../types/organization";
import { useParams } from "react-router-dom";
import { dateToOffset } from "../lib";

function CreateContractForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const form = useForm<NewContractForm>({
    mode: "uncontrolled",
    validate: zodResolver(NewContractForm),
  });
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [counterParties, setCounterParties] = useState<CounterParty[]>([]);
  const { api } = useAuth();
  const params = useParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  form.setFieldValue("organization_id", organizationId);

  const handleSubmit = async (data: NewContractForm) => {
    create();

    const { body, status } = await api.createContract({
      body: {
        ...data,
        effective_date: dateToOffset(data.effective_date),
        end_date: dateToOffset(data.end_date),
      },
    });

    if (status === 200) {
      notifications.show({
        title: "Create Contract",
        message: "Successfully created contract",
      });
    } else {
      notifications.show({
        color: "red.7",
        title: "Create Contract",
        message: "Error creating contract",
      });
    }
    finish();
  };

  console.log(form.errors);
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

  const fetchCounterParties = useCallback(async () => {
    const { body, status } = await api.getCounterParties({
      params: {
        organizationId,
      },
      query: {
        page: 1,
        size: 100,
      },
    });

    if (status === 200) {
      setCounterParties(body.data);
    } else {
      notifications.show({
        color: "red",
        message: "Invalid organization",
      });
    }
  }, [organizationId, api.getCounterParties]);

  useEffect(() => {
    fetchContractTypes();
    fetchCounterParties();
  }, [fetchContractTypes, fetchCounterParties]);

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
              key={form.key("contract_type_id")}
              {...form.getInputProps("contract_type_id")}
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
              label="End Date"
              placeholder="Pick contract end date"
              size="md"
              key={form.key("end_date")}
              {...form.getInputProps("end_date")}
            />
            <Select
              searchable
              label="Counterparty"
              placeholder="Select"
              size="md"
              data={counterParties.map((c) => ({ value: c.id, label: c.name }))}
              key={form.key("counterparty_id")}
              {...form.getInputProps("counterparty_id")}
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
