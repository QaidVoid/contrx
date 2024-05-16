import { useForm, zodResolver } from "@mantine/form";
import useAuth from "../hooks/use-auth";
import { Contract, ContractApprovers, ContractApproversInfo } from "../types/contract";
import { useCallback, useEffect, useState } from "react";
import { Drawer, Group, Stack, Text } from "@mantine/core";
import { IconCheck, IconEye } from "@tabler/icons-react";

type Props = {
  contractId: string;
  opened: boolean;
  close: () => void;
};

function ContractApproversList({ contractId, opened, close }: Props) {
  const { api } = useAuth();
  const [approvers, setApprovers] = useState<ContractApproversInfo>();

  const form = useForm<ContractApprovers>({
    mode: "uncontrolled",
    validate: zodResolver(ContractApprovers),
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

  useEffect(() => {
    fetchApprovers();
  }, [fetchApprovers]);

  return (
    <Drawer opened={opened} onClose={close} title="Approvers" position="right" size="lg">
      {approvers?.map((approver) => (
        <Stack gap={16}>
          <Group gap={16}>
            <Text>{approver.approver_name}</Text>

            <IconEye />

            <IconCheck />
          </Group>
        </Stack>
      ))}
    </Drawer>
  );
}

export default ContractApproversList;
