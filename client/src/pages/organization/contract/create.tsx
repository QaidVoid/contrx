import { Button, Group, Select, Stack, Stepper, Text, TextInput } from "@mantine/core";
import TitleBar from "../../../components/title-bar";
import { useState } from "react";
import BasicContractDetail from "../../../components/contract/basic-detail";
import { useForm, zodResolver } from "@mantine/form";
import { NewContractTypePayload } from "../../../types/contract-type";

function CreateContractType() {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 1 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm<NewContractTypePayload>({
    mode: "uncontrolled",
    validate: zodResolver(NewContractTypePayload),
  });

  return (
    <>
      <TitleBar>
        <Text>New Contract Type</Text>
      </TitleBar>

      <Stack p="md" w="600px">
        <form onSubmit={console.log}>
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
                label="Category"
                placeholder="Select category"
                size="md"
                data={["Business", "Human Resource", "Products", "Services"]}
                key={form.key("category")}
                {...form.getInputProps("category")}
              />

              <Select
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
                />

                <Select
                  label="Party B"
                  placeholder="Select party"
                  size="md"
                  data={["My Organization", "CounterParty"]}
                  key={form.key("party_b_is_self")}
                  {...form.getInputProps("party_b_is_self")}
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
              <Button key="step" onClick={nextStep}>Next step</Button>
            )}
          </Group>
        </form>
      </Stack>
    </>
  );
}

export default CreateContractType;
