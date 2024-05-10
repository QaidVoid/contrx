import { Button, Group, Select, Stack, Stepper, Text, TextInput } from "@mantine/core";
import TitleBar from "../../../components/title-bar";
import { useCallback, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { NewContractTypePayload } from "../../../types/contract-type";
import { match } from "ts-pattern";

function CreateContractType() {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 1 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm<NewContractTypePayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewContractTypePayload),
  });

  const handleSubmit = useCallback((data: NewContractTypePayload) => {
    console.log(NewContractTypePayload.parse(data));
  }, []);

  const handlePartyChange = (value: string, partyA = true) => {
    match({ value, partyA })
      .with(
        {
          value: "My Organization",
          partyA: true,
        },
        () => {
          form.setFieldValue("party_b_is_self", "CounterParty");
        },
      )
      .with(
        {
          value: "CounterParty",
          partyA: true,
        },
        () => {
          form.setFieldValue("party_b_is_self", "My Organization");
        },
      )
      .with({ value: "My Organization", partyA: false }, () => {
        form.setFieldValue("party_a_is_self", "CounterParty");
      })
      .with({ value: "CounterParty", partyA: false }, () => {
        form.setFieldValue("party_a_is_self", "My Organization");
      });
  };

  return (
    <>
      <TitleBar>
        <Text>New Contract Type</Text>
      </TitleBar>

      <Stack p="md" w="600px">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
            <Stepper.Step label="Basic Details" description="Basic contract details">
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

              <Group grow>
                <Select
                  label="Party A"
                  placeholder="Select party"
                  size="md"
                  data={["My Organization", "CounterParty"]}
                  key={form.key("party_a_is_self")}
                  {...form.getInputProps("party_a_is_self")}
                  onChange={(v) => handlePartyChange(v)}
                />

                <Select
                  label="Party B"
                  placeholder="Select party"
                  size="md"
                  data={["My Organization", "CounterParty"]}
                  key={form.key("party_b_is_self")}
                  {...form.getInputProps("party_b_is_self")}
                  onChange={(v) => handlePartyChange(v, false)}
                />
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Template" description="Contract Template">
              Tmplate
            </Stepper.Step>
          </Stepper>

          <Group justify="center" mt="xl">
            <Button key="back" variant="default" onClick={prevStep}>
              Back
            </Button>
            {active === 1 ? (
              <Button type="submit">Finish</Button>
            ) : (
              <Button key="step" onClick={nextStep}>
                Next step
              </Button>
            )}
          </Group>
        </form>
      </Stack>
    </>
  );
}

export default CreateContractType;
