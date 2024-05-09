import { ActionIcon, Box, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CreateClauseForm from "../../components/create-clause-form";
import Table from "../../components/table";
import TitleBar from "../../components/title-bar";
import useAuth from "../../hooks/use-auth";
import type { ClauseResponse, PaginatedClausesResponse } from "../../types/clause";
import EditClause from "../../components/edit-clause-form";
import dayjs from "dayjs";
import { parseDate } from "../../lib";

function OrganizationClauses() {
  const { api } = useAuth();
  const params = useParams();
  const [clauses, setClauses] = useState<PaginatedClausesResponse>({
    data: [],
    total_count: 0,
  });
  const [fetching, { open: fetch, close: completeFetch }] = useDisclosure(false);
  const [clause, setClause] = useState<ClauseResponse | undefined>();
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

        <EditClause
          onEdit={fetchClauses}
          opened={Boolean(clause)}
          clause={clause}
          close={() => setClause(undefined)}
        />
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
              render: (record) => {
                return <Link to={`/${organizationId}/clause/${record.id}`}>{record.name}</Link>;
              },
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
              render: (record) => dayjs(parseDate(record.last_modified_at)).format("MMM DD, YYYY"),
            },
            {
              accessor: "actions",
              title: <Box mr={6}>Actions</Box>,
              textAlign: "right",
              render: (record) => (
                <Group gap={4} justify="right" wrap="nowrap">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => setClause(record)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon size="sm" variant="subtle" color="red" onClick={() => { }}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
        />
      </Stack>
    </>
  );
}

export default OrganizationClauses;
