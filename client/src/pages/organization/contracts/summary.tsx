import { Center, Paper, Stack } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import useAuth from "../../../hooks/use-auth";
import { useParams } from "react-router-dom";
import type { Contract } from "../../../types/contract";
import RenderHTML from "../../../components/html-content";

function ContractSummary() {
  const { api } = useAuth();
  const params = useParams();
  const [doc, setDoc] = useState({ type: "doc", content: [] });

  if (!params.organizationId || !params.contractId) return;

  const { contractId, organizationId } = params;

  const fetchContract = useCallback(async () => {
    const { body, status } = await api.getContract({
      params: {
        contractId,
      },
    });

    if (status === 200) {
      const output = body.document.flatMap((item) => {
        if (item.language && item.language.content) {
          return item.language.content;
        }
        return [];
      });
      const value = {
        type: "doc",
        content: output,
      };
      setDoc(value);
    }
  }, [api.getContract, contractId]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  if (!doc) return;

  return (
    <Center>
      <Stack w="50%" miw="900px" p="md">
        <Paper withBorder p={18}>
          <RenderHTML content={doc} />
        </Paper>
      </Stack>
    </Center>
  );
}

export default ContractSummary;
