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
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import api from "../services/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import type { LoginPayload } from "../types/auth";

function Login() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (data: LoginPayload) => {
    setIsLoggingIn(true);
    const { body, status } = await api.login({
      body: data,
    });

    if (status === 200) {
      notifications.show({
        title: "Login",
        message: "Logged in successfully.",
      });
    } else if (status === 422) {
      notifications.show({
        color: "red.7",
        title: "Login",
        message: "Invalid credentials",
      });
    } else {
      notifications.show({
        color: "red.7",
        title: "Login",
        message: "Unknown error",
      });
    }
    setIsLoggingIn(false);
  };

  return (
    <Group h="100vh" justify="center" align="center">
      <Paper radius={16} p={30} withBorder shadow="md" w="90%" maw="600px">
        <Title c="blue.8" order={2} ta="center" mt="md" mb={50}>
          Welcome back!
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button type="submit" fullWidth mt="xl" size="md" disabled={isLoggingIn}>
            <LoadingOverlay
              visible={isLoggingIn}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            Login
          </Button>

          <Text ta="center" mt="md">
            Don&apos;t have an account?{" "}
            <Anchor<"a"> href="#" fw={700} onClick={(event) => event.preventDefault()}>
              Register
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Group>
  );
}

export default Login;
