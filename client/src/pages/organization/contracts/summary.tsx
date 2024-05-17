import { Button, Center, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import useAuth from "../../../hooks/use-auth";
import { useParams } from "react-router-dom";
import type { Contract } from "../../../types/contract";
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
  const [viewApprovers, setViewApprovers] = useState(false);

  if (!params.organizationId || !params.contractId) return;

  const { contractId, organizationId } = params;

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

  const handleContractView = useCallback(async () => {
    await api.handleApproval({
      body: {
        contract_id: contractId,
        approver_id: auth.user_id,
        status: "Viewed",
      },
    });
  }, [api.handleApproval, contractId, auth.user_id]);

  useEffect(() => {
    fetchContract();
    handleContractView();
  }, [fetchContract, handleContractView]);

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
          <>
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

              {contract.status === "Draft" ? (
                <Button bg="blue.6" onClick={handlePublish}>
                  Publish
                </Button>
              ) : undefined}
            </Group>
          </>
        ) : (
          <Group gap={12}>
            <Button c="gray.1" bg="blue.8" onClick={() => {}}>
              Approve Contract
            </Button>
            <Button c="gray.1" bg="red.8" onClick={() => {}}>
              Reject Contract
            </Button>
          </Group>
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
