import { Card, Divider, Stack, Text } from "@mantine/core";
import type { ClauseResponse } from "../../../types/clause";
import TitleBar from "../../../components/title-bar";
import useAuth from "../../../hooks/use-auth";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import RenderHTML from "../../../components/html-content";

function OrganizationClause() {
  const { api } = useAuth();
  const params = useParams();
  const [clause, setClause] = useState<ClauseResponse>();

  if (!params.clauseId) return;

  const clauseId = params.clauseId;

  const fetchClause = useCallback(async () => {
    const { body, status } = await api.getClause({
      params: {
        clauseId,
      }
    });

    if (status === 200) {
      setClause(body);
    } else {
      notifications.show({
        color: "red",
        message: "Error fetching clause",
      });
    }
  }, [clauseId, api.getClause]);

  useEffect(() => {
    fetchClause();
  }, [fetchClause]);


  if (!clause) return;

  return (
    <>
      <TitleBar>
        <Text c="white">{clause.name}</Text>
      </TitleBar>

      <Stack p="md">
        <Card withBorder w="100%">
          <Card.Section p="sm">
            {clause.name}
          </Card.Section>

          <Card.Section py="md">
            <Divider />
          </Card.Section>

          <Card.Section p="sm">
            <RenderHTML content={clause.language} />
          </Card.Section>
        </Card>
      </Stack>
    </>
  );
}

export default OrganizationClause;
