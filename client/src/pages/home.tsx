import { AppShell, Burger, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

const links = [
  { label: "Login", value: "/login", variant: "outline" },
  { label: "Register", value: "/register", variant: "gradient" },
];

function Home() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const navLinks = links.map((link) => (
    <Button key={link.label} variant={link.variant} onClick={() => navigate(link.value)}>
      {link.label}
    </Button>
  ));

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header w={1140} mx="auto">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text>Logo</Text>
            <Group gap={8} visibleFrom="sm">
              {navLinks}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main w={1140} mx="auto">
        Main Content
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;
