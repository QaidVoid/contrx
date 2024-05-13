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

function ContractSummary() {
  const { api } = useAuth();
  const params = useParams();
  const [contract, setContract] = useState<Contract>();
  const [doc, setDoc] = useState<JSONContent>({ type: "doc", content: [] });
  const [preview, setPreview] = useState(false);

  if (!params.organizationId || !params.contractId) return;

  const { contractId, organizationId } = params;

  const fetchContract = useCallback(async () => {
    const { body, status } = await api.getContract({
      params: {
        contractId,
      },
    });
    console.log("BODY:", body);

    if (status === 200) {
      setContract(body);
      setDoc(body.document);
    }
  }, [api.getContract, contractId]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

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

          <Button bg="blue.6" onClick={handleSave}>
            Save
          </Button>

          <Button bg="blue.6" onClick={handlePublish}>
            Publish
          </Button>
        </Group>
      </TitleBar>

      <Center>
        <Stack w="50%" miw="900px" p="md">
          <Paper withBorder p={18}>
            <Center py="md">
              <Title>{contract.title}</Title>
            </Center>

            {preview ? (
              <RenderHTML content={doc} />
            ) : (
              <TextEditor value={doc} error={undefined} onChange={(value) => setDoc(value)} />
            )}
          </Paper>
        </Stack>
      </Center>
    </>
  );
}

export default ContractSummary;
