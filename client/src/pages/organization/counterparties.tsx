import { ActionIcon, Box, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Table from "../../components/table";
import TitleBar from "../../components/title-bar";
import useAuth from "../../hooks/use-auth";
import type { CounterParty, PaginatedCounterParties } from "../../types/organization";
import CreateCounterPartyForm from "../../components/create-counterparty-form";
import EditCounterParty from "../../components/counterparty/edit";

function CounterParties() {
  const { api } = useAuth();
  const params = useParams();
  const [counterParties, setCounterParties] = useState<PaginatedCounterParties>({
    data: [],
    total_count: 0,
  });
  const [fetching, { open: fetch, close: completeFetch }] = useDisclosure(false);
  const [counterParty, setCounterParty] = useState<CounterParty | undefined>();
  const [searchParams, _] = useSearchParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchCounterParties = useCallback(async () => {
    fetch();
    const { body, status } = await api.getCounterParties({
      params: {
        organizationId,
      },
      query: {
        page: Number(searchParams.get("page") ?? 1),
        size: Number(searchParams.get("size") ?? 10),
      },
    });

    if (status === 200) {
      setCounterParties(body);
    } else {
      notifications.show({
        color: "red",
        message: "Invalid organization",
      });
    }
    completeFetch();
  }, [organizationId, api.getCounterParties, fetch, completeFetch, searchParams]);

  useEffect(() => {
    fetchCounterParties();
  }, [fetchCounterParties]);

  return (
    <>
      <TitleBar>
        <Text c="white">Counterparties</Text>
        <CreateCounterPartyForm organizationId={organizationId} onCreate={fetchCounterParties} />
      </TitleBar>

      <EditCounterParty
        counterparty={counterParty}
        opened={!!counterParty}
        close={() => setCounterParty(undefined)}
      />

      <Stack p="md">
        <Table
          records={counterParties.data}
          totalCount={counterParties.total_count}
          fetcher={fetchCounterParties}
          fetching={fetching}
          columns={[
            {
              accessor: "name",
              title: "Name",
              render: (record) => record.name,
            },
            {
              accessor: "type",
              title: "Type",
              render: (record) => record.type,
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
                    onClick={() => setCounterParty(record)}
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

export default CounterParties;
