import { Button, Center, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../../hooks/use-auth";
import { useParams } from "react-router-dom";
import type { Contract, ContractApproversInfo } from "../../../types/contract";
import RenderHTML from "../../../components/html-content";
import TitleBar from "../../../components/title-bar";
import TextEditor from "../../../components/super-rich-editor";
import type { JSONContent } from "@tiptap/react";
import { notifications } from "@mantine/notifications";
import ContractApproversList from "../../../components/contract-approvers";

function ContractSummary() {
  const { api, auth } = useAuth();
  const params = useParams();
  const [contract, setContract] = useState<Contract>();
  const [doc, setDoc] = useState<JSONContent>({ type: "doc", content: [] });
  const [edited, setEdited] = useState(false);
  const [preview, setPreview] = useState(false);
  const [approvers, setApprovers] = useState<ContractApproversInfo>();
  const [viewApprovers, setViewApprovers] = useState(false);

  if (!params.organizationId || !params.contractId) return;

  const { contractId } = params;

  const fetchContract = useCallback(async () => {
    const { body, status } = await api.getContract({
      params: {
        contractId,
      },
    });

    if (status === 200) {
      setContract(body);
      setDoc(body.document);
    }
  }, [api.getContract, contractId]);

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

  const handleContractView = useCallback(async () => {
    if (approver?.approval_status.toLowerCase() === "pending") {
      await api.handleApproval({
        body: {
          contract_id: contractId,
          approver_id: auth.user_id,
          status: "Viewed",
        },
      });
    }
  }, [api.handleApproval, contractId, auth.user_id]);

  const handleContractApprove = useCallback(async () => {
    await api.handleApproval({
      body: {
        contract_id: contractId,
        approver_id: auth.user_id,
        status: "Approved",
      },
    });
  }, [api.handleApproval, contractId, auth.user_id]);

  const handleContractReject = useCallback(async () => {
    await api.handleApproval({
      body: {
        contract_id: contractId,
        approver_id: auth.user_id,
        status: "Rejected",
      },
    });
  }, [api.handleApproval, contractId, auth.user_id]);

  useEffect(() => {
    fetchContract();
    fetchApprovers();
    handleContractView();
  }, [fetchContract, handleContractView, fetchApprovers]);

  const approver = useMemo(() => {
    return approvers?.find((approver) => approver.approver_id === auth.user_id);
  }, [approvers, auth.user_id]);

  if (!doc || !contract) return;

  const handleSave = async () => {
    const { status: uStatus } = await api.updateContractTitle({
      params: {
        contractId,
      },
      body: {
        title: contract.title,
      },
    });

    const { status: ucStatus } = await api.updateContractDoc({
      params: {
        contractId,
      },
      body: {
        document: doc,
      },
    });

    if (uStatus === 200 && ucStatus === 200) {
      setContract((prev) => ({ ...prev, status: "Draft" }));
      setEdited(false);
      notifications.show({
        title: "Contract",
        message: "Contract updated",
      });
    }
  };

  const handlePublish = async () => {
    const { status } = await api.publishContract({
      params: {
        contractId,
      },
    });

    if (status === 200) {
      setContract((prev) => ({ ...prev, status: "Published" }));
      setEdited(false);
      notifications.show({
        title: "Contract",
        message: "Contract published successfully",
      });
    }
  };

  return (
    <>
      <TitleBar>
        <Text c="white">Contract</Text>

        {contract.contract_owner === auth.user_id ? (
          <Group gap={12}>
            <Button bg="blue.6" onClick={() => setViewApprovers(true)}>
              View Approvers
            </Button>

            <Group>
              {preview ? (
                <Button bg="blue.6" onClick={() => setPreview(false)}>
                  Edit
                </Button>
              ) : (
                <Button bg="blue.6" onClick={() => setPreview(true)}>
                  Preview
                </Button>
              )}

              {edited ? (
                <Button bg="yellow.6" onClick={handleSave} c="gray.8">
                  Save Draft
                </Button>
              ) : undefined}

              {contract.status.toLowerCase() === "draft" ? (
                <Button bg="blue.6" onClick={handlePublish}>
                  Publish
                </Button>
              ) : undefined}
            </Group>
          </Group>
        ) : (
          <>
            {contract.status.toLowerCase() === "published" &&
              approver?.approval_status.toLowerCase() !== "approved" &&
              approver?.approval_status.toLowerCase() !== "rejected" ? (
              <Group gap={12}>
                <Button c="gray.1" bg="blue.8" onClick={handleContractApprove}>
                  Approve Contract
                </Button>
                <Button c="gray.1" bg="red.8" onClick={handleContractReject}>
                  Reject Contract
                </Button>
              </Group>
            ) : approver?.approval_status.toLowerCase() === "approved" ? (
              <Text>You've approved this contract</Text>
            ) : approver?.approval_status.toLowerCase() === "rejected" ? (
              <Text>You've rejected this contract</Text>
            ) : (
              <Text>Draft</Text>
            )}
          </>
        )}
      </TitleBar>

      <ContractApproversList
        contractId={contract.id}
        opened={viewApprovers}
        close={() => setViewApprovers(false)}
      />

      <Center>
        <Stack w="50%" miw="900px" p="md">
          <Paper withBorder p={18}>
            <Center py="md">
              <Title>{contract.title}</Title>
            </Center>

            {preview || contract.contract_owner !== auth.user_id || contract.status !== "Draft" ? (
              <RenderHTML content={doc} />
            ) : (
              <TextEditor
                value={doc}
                error={undefined}
                onChange={(value) => {
                  setEdited(true);
                  setDoc(value);
                }}
              />
            )}
          </Paper>
        </Stack>
      </Center>
    </>
  );
}

export default ContractSummary;
