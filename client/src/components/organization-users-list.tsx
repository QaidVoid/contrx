import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAuth from "../hooks/use-auth";
import type { PaginatedOrganizationUsers } from "../types/user";
import { Group, Avatar, Stack, Badge, Button, Text } from "@mantine/core";
import { IconMailPlus, IconUserMinus } from "@tabler/icons-react";

type Props = {
  organizationId: string;
  status: string;
};

function OrganizationUsersList({ organizationId, status }: Props) {
  const { api, auth } = useAuth();
  const [fetching, { open: fetch, close: completeFetch }] = useDisclosure(false);
  const [users, setUsers] = useState<PaginatedOrganizationUsers>({
    data: [],
    total_count: 0,
  });
  const [searchParams, _] = useSearchParams();

  const fetchOrganizationUsers = useCallback(async () => {
    fetch();
    const { body, status } = await api.getOrganizationUsers({
      params: {
        organizationId,
      },
      query: {
        page: Number(searchParams.get("page") ?? 1),
        size: Number(searchParams.get("size") ?? 10),
      },
    });

    if (status === 200) {
      setUsers(body);
    } else {
      notifications.show({
        color: "red",
        message: "Failed to fetch organization users",
      });
    }

    completeFetch();
  }, [api.getOrganizationUsers, fetch, completeFetch, searchParams, organizationId]);

  useEffect(() => {
    fetchOrganizationUsers();
  }, [fetchOrganizationUsers]);

  return users?.data.map((user) => (
    <Group justify="space-between" key={user.id} p={12}>
      <Group>
        <Avatar src={user.role} />
        <Stack gap={4}>
          <Group>
            <Text size="sm" fw={600}>
              {user.first_name} {user.last_name}
            </Text>

            <Badge variant="light">{user.role}</Badge>
          </Group>
          <Text size="xs" c="dimmed">
            {user.email}
          </Text>
        </Stack>
      </Group>
    </Group>
  ));
}

export default OrganizationUsersList;
