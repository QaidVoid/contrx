import { Badge, Stack, Text } from "@mantine/core";
import CreateContractForm from "../components/create-contract-form";
import TitleBar from "../components/title-bar";
import useAuth from "../hooks/use-auth";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Table from "../components/table";
import type { PaginatedContracts } from "../types/contract";
import dayjs from "dayjs";
import { parseDate } from "../lib";

function Contracts() {
  const { api } = useAuth();
  const params = useParams();
  const [contracts, setContracts] = useState<PaginatedContracts>({
    data: [],
    total_count: 0,
  });
  const [fetching, { open: fetch, close: completeFetch }] = useDisclosure(false);
  const [searchParams, _] = useSearchParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchContracts = useCallback(async () => {
    fetch();

    const { body, status } = await api.getContracts({
      params: {
        organizationId,
      },
      query: {
        page: Number(searchParams.get("page") ?? 1),
        size: Number(searchParams.get("size") ?? 10),
      },
    });

    if (status === 200) {
      setContracts(body);
    } else {
      notifications.show({
        color: "red",
        message: "Failed to fetch contracts",
      });
    }
    completeFetch();
  }, [organizationId, api.getContracts, fetch, completeFetch, searchParams]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return (
    <>
      <TitleBar>
        <Text c="white">Contracts</Text>
        <CreateContractForm onCreate={fetchContracts} />
      </TitleBar>

      <Stack p="md">
        <Table
          records={contracts.data}
          totalCount={contracts.total_count}
          fetcher={fetchContracts}
          fetching={fetching}
          columns={[
            {
              accessor: "title",
              title: "Title",
              render: (record) => (
                <Link to={`/${organizationId}/contract/${record.id}`}>{record.title}</Link>
              ),
            },
            {
              accessor: "status",
              title: "Status",
              render: ({ status }) => <Badge bg={status === "Published" ? "green.8" : "yellow.6"}>{status}</Badge>,
            },
            {
              accessor: "counterparty_name",
              title: "Counterparty",
            },
            {
              accessor: "effective_date",
              title: "Effective Date",
              render: (record) => dayjs(parseDate(record.effective_date)).format("MMM DD, YYYY"),
            },
            {
              accessor: "end_date",
              title: "End Date",
              render: (record) => dayjs(parseDate(record.end_date)).format("MMM DD, YYYY"),
            },
          ]}
        />
      </Stack>
    </>
  );
}

export default Contracts;
