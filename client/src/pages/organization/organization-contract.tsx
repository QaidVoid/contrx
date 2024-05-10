import { useCallback, useEffect, useState } from "react";
import { Button, Text, Stack } from "@mantine/core";
import TitleBar from "../../components/title-bar";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/use-auth";
import type { PaginatedContractTypes } from "../../types/contract-type";
import { notifications } from "@mantine/notifications";
import Table from "../../components/table";
import { useDisclosure } from "@mantine/hooks";

function OrganizationContract() {
  const { api } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [fetching, { open: fetch, close: completeFetch }] = useDisclosure(false);
  const [contracts, setContracts] = useState<PaginatedContractTypes>({
    data: [],
    total_count: 0,
  });
  const [searchParams, _] = useSearchParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchContracts = useCallback(async () => {
    fetch();
    const { body, status } = await api.getTemplates({
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
        message: "Failed to fetch contract types",
      });
    }
    completeFetch();
  }, [api.getTemplates, fetch, completeFetch, searchParams]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return (
    <>
      <TitleBar>
        <Text c="white">Contract Types</Text>

        <Button bg="blue.6" onClick={() => navigate(`/${organizationId}/contract/new`)}>
          Create Contract
        </Button>
      </TitleBar>

      <Stack p="md">
        <Table
          records={contracts.data}
          totalCount={contracts.total_count}
          fetcher={fetchContracts}
          fetching={fetching}
          columns={[
            {
              accessor: "name",
              title: "Contract Name",
              render: (record) => {
                  return <Link to={`/${organizationId}/contract/${record.id}`}>{record.name}</Link>
              }
            },
            {
              accessor: "status",
              title: "Status",
              render: (record) => record.status
            }
          ]}
        />
      </Stack>
    </>
  );
}

export default OrganizationContract;
