import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Group,
} from "@mantine/core";

function Login() {
  return (
    <Group h="100vh" justify="center" align="center">
      <Paper radius={16} p={30} withBorder shadow="md" w="90%" maw="600px">
        <Title c="blue.8" order={2} ta="center" mt="md" mb={50}>
          Welcome back!
        </Title>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="md" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md">
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a"> href="#" fw={700} onClick={(event) => event.preventDefault()}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </Group>
  );
}

export default Login;
