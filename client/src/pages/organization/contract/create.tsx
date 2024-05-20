import { Box, Button, Group, Select, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback } from "react";
import { match } from "ts-pattern";
import TitleBar from "../../../components/title-bar";
import useAuth from "../../../hooks/use-auth";
import { NewContractTypeForm, parseContractType } from "../../../types/contract-type";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";

function CreateContractType() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const form = useForm<NewContractTypeForm>({
    mode: "uncontrolled",
    validate: zodResolver(NewContractTypeForm),
  });

  const handleSubmit = useCallback(
    async (data: NewContractTypeForm) => {
      const validated = parseContractType(data);

      const { body, status } = await api.createContractType({
        body: validated,
      });

      if (status === 200) {
        notifications.show({
          title: "Contract Type",
          message: "Contract type created successfully",
        });

        navigate(`/${organizationId}/contract-types/${body.id}`, { replace: true });
      } else {
        notifications.show({
          color: "red.5",
          title: "Contract Type",
          message: "Failed to create contract type",
        });
      }
    },
    [organizationId, api.createContractType, navigate],
  );

  const handlePartyChange = (value: string | null, partyA = true) => {
    match({ value, partyA })
      .with(
        {
          value: "My Organization",
          partyA: true,
        },
        () => {
          form.setFieldValue("party_a", "My Organization");
          form.setFieldValue("party_b", "CounterParty");
        },
      )
      .with(
        {
          value: "CounterParty",
          partyA: true,
        },
        () => {
          form.setFieldValue("party_a", "CounterParty");
          form.setFieldValue("party_b", "My Organization");
        },
      )
      .with({ value: "My Organization", partyA: false }, () => {
        form.setFieldValue("party_a", "CounterParty");
        form.setFieldValue("party_b", "My Organization");
      })
      .with({ value: "CounterParty", partyA: false }, () => {
        form.setFieldValue("party_a", "My Organization");
        form.setFieldValue("party_b", "CounterParty");
      });
  };

  return (
    <>
      <TitleBar>
        <Text c="white">New Contract Type</Text>
      </TitleBar>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack p="md" gap={16}>
          <TextInput
            label="Name"
            placeholder="Contract Name"
            size="md"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />

          <Select
            searchable
            label="Category"
            placeholder="Select category"
            size="md"
            data={["Business", "Human Resource", "Products", "Services"]}
            key={form.key("category")}
            {...form.getInputProps("category")}
          />

          <Select
            searchable
            label="Intent"
            placeholder="Select intent"
            size="md"
            data={["Buy", "Sell", "Other"]}
            key={form.key("intent")}
            {...form.getInputProps("intent")}
          />

          <Group align="start" grow>
            <Select
              allowDeselect={false}
              label="Party A"
              placeholder="Select party"
              size="md"
              data={["My Organization", "CounterParty"]}
              key={form.key("party_a")}
              {...form.getInputProps("party_a")}
              onChange={(v) => handlePartyChange(v)}
            />

            <Select
              allowDeselect={false}
              label="Party B"
              placeholder="Select party"
              size="md"
              data={["My Organization", "CounterParty"]}
              key={form.key("party_b")}
              {...form.getInputProps("party_b")}
              onChange={(v) => handlePartyChange(v, false)}
            />
          </Group>

          <Box>
            <Button type="submit">Save</Button>
          </Box>
        </Stack>
      </form>
    </>
  );
}

export default CreateContractType;
