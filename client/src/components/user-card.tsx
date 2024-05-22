import { Avatar, Group, Menu, Stack, Text, rem } from "@mantine/core";
import useAuth from "../hooks/use-auth";
import { IconChevronRight, IconLogout, IconSettings, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function UserCard() {
  const { user, api } = useAuth();
  const navigate = useNavigate();

  return (
    <Menu withArrow shadow="md" width={280}>
      <Menu.Target>
        <Group p="md" className="hover:bg-gray-100 hover:cursor-pointer" justify="space-between">
          <Group>
            <Avatar>TU</Avatar>

            <Stack gap={0}>
              <Text>
                {user.first_name} {user.last_name}
              </Text>
              <Text c="dimmed" size="sm">
                {user.email}
              </Text>
            </Stack>
          </Group>

          <IconChevronRight size="1rem" />
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => navigate("/profile")}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
          onClick={async () => {
            await api.logout();
            navigate("/");
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserCard;
