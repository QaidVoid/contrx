import { Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CreateClauseForm from "../../components/create-clause-form";
import Table from "../../components/table";
import TitleBar from "../../components/title-bar";
import useAuth from "../../hooks/use-auth";
import type { PaginatedClausesResponse } from "../../types/clause";

function OrganizationClauses() {
  const { api } = useAuth();
  const params = useParams();
  const [clauses, setClauses] = useState<PaginatedClausesResponse>({
    data: [],
    total_count: 0
  });
  const [fetching, { open: fetch, close: completeFetch }] = useDisclosure(false);
  const [searchParams, _] = useSearchParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchClauses = useCallback(async () => {
    fetch();
    const { body, status } = await api.getClauses({
      params: {
        organizationId,
      },
      query: {
        page: Number(searchParams.get("page") ?? 1),
        size: Number(searchParams.get("size") ?? 10),
      },
    });

    if (status === 200) {
      setClauses(body);
    } else {
      notifications.show({
        color: "red",
        message: "Invalid organization",
      });
    }
    completeFetch();
  }, [organizationId, api.getClauses, fetch, completeFetch, searchParams]);

  useEffect(() => {
    fetchClauses();
  }, [fetchClauses]);

  return (
    <>
      <TitleBar>
        <Text c="white">Clause Library</Text>
        <CreateClauseForm organizationId={organizationId} onCreate={fetchClauses} />
      </TitleBar>

      <Stack p="md">
        <Table
          records={clauses.data}
          totalCount={clauses.total_count}
          fetcher={fetchClauses}
          fetching={fetching}
          columns={[
            {
              accessor: "name",
              title: "Clause Name",
              render: (record) => record.name,
            },
            {
              accessor: "type",
              title: "Clause Type",
              render: (record) => record.type,
            },
            {
              accessor: "last_modified_by",
              title: "Last Modified By",
              render: (record) => record.last_modified_by,
            },
            {
              accessor: "last_modified_at",
              title: "Last Modified At",
              render: (record) => record.last_modified_at,
            },
          ]}
        />
      </Stack>
    </>
  );
}

export default OrganizationClauses;
