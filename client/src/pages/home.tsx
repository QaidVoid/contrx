import {
  AppShell,
  Burger,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconClipboard, IconHeartHandshake, IconLayersLinked, IconLock } from "@tabler/icons-react";
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
        <section
          style={{ background: "linear-gradient(to right, #000000, #000000)", padding: "5rem 0" }}
        >
          <Container style={{ textAlign: "center", color: "white" }}>
            <Title order={1} style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              Contrx - Decentralized Contract Management
            </Title>
            <Text size="lg" style={{ marginBottom: "2rem" }}>
              Powered by the Near protocol, Contrx offers a secure and transparent way to manage
              your contracts. It's open-source and free for everyone.
            </Text>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <Button variant="filled" color="dark">
                Sign Up
              </Button>
            </div>
          </Container>
        </section>
        <section style={{ padding: "5rem 0" }}>
          <Container>
            <Grid gutter="lg">
              <Grid.Col span={4} mb={4}>
                <div style={{ textAlign: "center" }}>
                  <Center>
                    <IconLock style={{ width: "3rem", height: "3rem", marginBottom: "1rem" }} />
                  </Center>
                  <Title order={3} style={{ marginBottom: "0.5rem" }}>
                    Secure Contracts
                  </Title>
                  <Text c="dimmed">
                    Blockchain-based security ensures your contracts are safe and tamper-proof.
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={4} mb={4}>
                <div style={{ textAlign: "center" }}>
                  <Center>
                    <IconClipboard
                      style={{ width: "3rem", height: "3rem", marginBottom: "1rem" }}
                    />
                  </Center>
                  <Title order={3} style={{ marginBottom: "0.5rem" }}>
                    Streamlined Workflow
                  </Title>
                  <Text c="dimmed">
                    Automate contract creation, signing, and management for maximum efficiency.
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={4} mb={4}>
                <div style={{ textAlign: "center" }}>
                  <Center>
                    <IconLayersLinked
                      style={{ width: "3rem", height: "3rem", marginBottom: "1rem" }}
                    />
                  </Center>
                  <Title order={3} style={{ marginBottom: "0.5rem" }}>
                    Transparent Auditing
                  </Title>
                  <Text c="dimmed">
                    Track all contract changes and activities with a transparent audit trail.
                  </Text>
                </div>
              </Grid.Col>
            </Grid>
          </Container>
        </section>
        <section style={{ background: "#f1f1f1", padding: "5rem 0" }}>
          <Container>
            <Grid gutter="lg" align="center">
              <Grid.Col span={12} mb={6}>
                <Title order={2} style={{ marginBottom: "1rem" }}>
                  How Contrx Works
                </Title>
                <Text c="dimmed" style={{ marginBottom: "2rem" }}>
                  Contrx leverages the power of the Near protocol to provide a decentralized and
                  secure contract management solution.
                </Text>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <IconClipboard style={{ width: "2rem", height: "2rem" }} />
                    <div>
                      <Title order={4} style={{ marginBottom: "0.5rem" }}>
                        Create Contracts
                      </Title>
                      <Text c="dimmed">
                        Easily create and customize your contracts using our intuitive interface.
                      </Text>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <IconHeartHandshake style={{ width: "2rem", height: "2rem" }} />
                    <div>
                      <Title order={4} style={{ marginBottom: "0.5rem" }}>
                        Secure Signing
                      </Title>
                      <Text c="dimmed">
                        Sign contracts securely using your Near wallet, ensuring transparency and
                        immutability.
                      </Text>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <IconLayersLinked style={{ width: "2rem", height: "2rem" }} />
                    <div>
                      <Title order={4} style={{ marginBottom: "0.5rem" }}>
                        Audit Trail
                      </Title>
                      <Text c="dimmed">
                        Track all contract changes and activities with a transparent audit trail.
                      </Text>
                    </div>
                  </div>
                </div>
              </Grid.Col>
            </Grid>
          </Container>
        </section>
        <section
          style={{ background: "#000000", padding: "5rem 0", textAlign: "center", color: "white" }}
        >
          <Container>
            <Title order={2} style={{ marginBottom: "1rem" }}>
              Experience the Future of Contract Management
            </Title>
            <Text size="lg" style={{ marginBottom: "2rem" }}>
              Join the Contrx community and take control of your contracts.
            </Text>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <Button variant="filled" color="dark">
                Sign Up
              </Button>
            </div>
          </Container>
        </section>
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;
