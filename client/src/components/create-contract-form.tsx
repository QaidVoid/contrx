import {
  Button,
  Checkbox,
  LoadingOverlay,
  Modal,
  MultiSelect,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Textarea
} from "@mantine/core";
import { DateInput, DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { NewContractPayload } from "../types/contract";
import { useState } from "react";
import useAuth from "../hooks/use-auth";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function CreateContractForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const [creating, { open: create, close: finish }] = useDisclosure(false);
  const form = useForm<NewContractPayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewContractPayload),
  });
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
        title: "Signup",
        message: "Error creating contract",
      });
    }
    finish();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Contract">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Select
            label="Contract Type"
            placeholder="Select contract type"
            size="md"
            data={["NDA", "Sales", "Employment", "Service"]}
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
            mt="md"
            size="md"
            key={form.key("description")}
            {...form.getInputProps("description")}
          />
          <DateInput
            label="Effective Date"
            placeholder="Pick contract effective date"
            mt="md"
            size="md"
            key={form.key("effective_date")}
            {...form.getInputProps("effective_date")}
          />
          <DateInput
            label="Expiry Date"
            placeholder="Pick contract expiry date"
            mt="md"
            size="md"
            key={form.key("expiry_date")}
            {...form.getInputProps("expiry_date")}
          />
          <MultiSelect
            searchable
            label="Parties"
            placeholder="Parties Involved"
            mt="md"
            size="md"
            data={["1", "2", "3"]}
            key={form.key("parties_involved")}
            {...form.getInputProps("parties_involved")}
          />
          <Button type="submit" fullWidth mt="xl" size="md" disabled={creating}>
            <LoadingOverlay
              visible={creating}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            Create Contract
          </Button>
        </form>
      </Modal>

      <Button onClick={open}>Create</Button>
    </>
  );
}

export default CreateContractForm;
