import { useCallback, useEffect, useMemo, useState } from "react";
import type { Notifications } from "../types/notification";
import useAuth from "../hooks/use-auth";
import { IconBell } from "@tabler/icons-react";
import { Button, Group, Modal, Popover, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const UserNotifications = () => {
  const [userNotifications, setUserNotifications] = useState<Notifications>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const { api } = useAuth();

  const fetchNotifications = useCallback(async () => {
    const { body, status } = await api.getNotifications();

    if (status === 200) {
      setUserNotifications(body);
    }
  }, [api.getNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadNotifications = useMemo(
    () => userNotifications.filter((n) => !n.read),
    [userNotifications],
  );

  return (
    <Popover>
      <Popover.Target>
        <Button unstyled className="relative me-6" onClick={open}>
          <IconBell />
          {unreadNotifications ? (
            <Text
              pos="absolute"
              top={-12}
              right={-12}
              c="white"
              bg="red.7"
              className="rounded-full w-6 text-center"
            >
              10
            </Text>
          ) : undefined}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap={8}>
          {userNotifications.length ? (
            userNotifications.map((n) => (
              <Group key={n.id} gap={8}>
                <Stack>
                  <Text>{n.title}</Text>
                  <Text>{n.message}</Text>
                </Stack>
              </Group>
            ))
          ) : (
            <Text>Nothing to see here</Text>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default UserNotifications;
