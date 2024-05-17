import { useForm, zodResolver } from "@mantine/form";
import useAuth from "../hooks/use-auth";
import {
  ContractApprovers,
  type ContractApproversInfo,
  type ProbableApprovers,
} from "../types/contract";
import { useCallback, useEffect, useState } from "react";
import { ActionIcon, Box, Button, Drawer, Group, Paper, Select, Stack, Text } from "@mantine/core";
import { IconCheck, IconEye, IconTrash, IconX } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

type Props = {
  contractId: string;
  opened: boolean;
  close: () => void;
};

function ContractApproversList({ contractId, opened, close }: Props) {
  const { api } = useAuth();
  const [approvers, setApprovers] = useState<ContractApproversInfo>();
  const [probableApprovers, setProbableApprovers] = useState<ProbableApprovers>();

  const form = useForm<ContractApprovers>({
    validate: zodResolver(ContractApprovers),
    initialValues: {
      contract_id: contractId,
      approvers: [],
    },
  });

  const fetchApprovers = useCallback(async () => {
    const { body, status } = await api.getContractApprovers({
      params: {
        contractId,
      },
    });

    if (status === 200) {
      setApprovers(body);
    }
  }, [contractId, api.getContractApprovers]);

  const fetchProbableApprovers = useCallback(async () => {
    const { body, status } = await api.getProbableApprovers({
      params: {
        contractId,
      },
    });

    if (status === 200) {
      setProbableApprovers(body);
    }
  }, [contractId, api.getProbableApprovers]);

  useEffect(() => {
    fetchApprovers();
    fetchProbableApprovers();
  }, [fetchApprovers, fetchProbableApprovers]);

  const handleAddApprovers = useCallback(
    async (data: ContractApprovers) => {
      const { status } = await api.addApprovers({
        body: data,
      });

      if (status === 200) {
        await fetchApprovers();
        form.reset();
      } else {
        notifications.show({
          color: "red.7",
          message: "Failed to add approvers",
        });
      }
    },
    [fetchApprovers, api.addApprovers, form.reset],
  );

  const fields = form.getValues().approvers.map((item, index) => (
    <Group key={item.key} mt="xs" maw={600} justify="space-between" align="start">
      <Select
        searchable
        allowDeselect={false}
        placeholder="Approver"
        style={{ flex: 1 }}
        size="sm"
        data={probableApprovers?.map((pa) => ({
          label: pa.name,
          value: pa.id,
        }))}
        key={form.key(`approvers.${index}.id`)}
        {...form.getInputProps(`approvers.${index}.id`)}
      />

      <ActionIcon color="red" onClick={() => form.removeListItem("approvers", index)}>
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <Drawer opened={opened} onClose={close} title="Approvers" position="right" size="sm">
      <Stack gap={16}>
        {approvers?.map((approver) => (
          <Stack gap={16}>
            <Paper withBorder shadow="lg" p="md">
              <Group gap={16} justify="space-between">
                <Text>{approver.approver_name}</Text>

                <Group>
                  <IconEye color={approver.approval_status !== "Pending" ? "blue" : undefined} />

                  {approver.approval_status === "Rejected" ? (
                    <IconX color="red" />
                  ) : (
                    <IconCheck
                      color={approver.approval_status === "Approved" ? "blue" : undefined}
                    />
                  )}
                </Group>
              </Group>
            </Paper>
          </Stack>
        ))}

        <Box mt="md">
          {fields.length > 0 ? (
            <Text size="sm" style={{ flex: 1 }}>
              Approver Name
            </Text>
          ) : (
            <Text c="dimmed" ta="center">
              Sed, no one here...
            </Text>
          )}

          {fields}
        </Box>

        <Group justify="center" mt="md">
          <Button
            disabled={
              form.getValues().approvers.length > 0 &&
              form.getValues().approvers[form.getValues().approvers.length - 1].id === ""
            }
            onClick={() => form.insertListItem("approvers", { id: "", key: randomId() })}
          >
            Add approver
          </Button>

          <form onSubmit={form.onSubmit(handleAddApprovers)}>
            <Button
              type="submit"
              disabled={
                form.getValues().approvers.length > 0 &&
                form.getValues().approvers[form.getValues().approvers.length - 1].id === ""
              }
            >
              Submit
            </Button>
          </form>
        </Group>
      </Stack>
    </Drawer>
  );
}

export default ContractApproversList;
