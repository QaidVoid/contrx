import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import api from "../services/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { NewUserPayload } from "../types/user";
import { match } from "ts-pattern";

function Register() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    validate: zodResolver(NewUserPayload),
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (data: NewUserPayload) => {
    setIsSigningUp(true);
    const { body, status } = await api.signup({
      body: data,
    });

    if (status === 200) {
      notifications.show({
        title: "Signup",
        message: "Successfully signed up",
      });
    } else if (status === 422) {
      const errors = body.errors;

      for (const error of errors) {
        match(error)
          .with({ code: "email_already_used" }, () => form.setFieldError("email", error.message))
          .with({ code: "empty_password" }, () => form.setFieldError("password", error.message))
          .with({ code: "empty_confirm_password" }, () =>
            form.setFieldError("confirm_password", error.message),
          )
          .with({ code: "password_mismatch" }, () =>
            form.setFieldError("confirm_password", error.message),
          );
      }

      notifications.show({
        color: "red.7",
        title: "Signup",
        message: "Invalid fields",
      });
    } else {
      notifications.show({
        color: "red.7",
        title: "Signup",
        message: "Unknown error",
      });
    }
    setIsSigningUp(false);
  };

  return (
    <Group h="100vh" justify="center" align="center">
      <Paper radius={16} p={30} withBorder shadow="md" w="90%" maw="600px">
        <Title c="blue.8" order={2} ta="center" mt="md" mb={50}>
          Welcome back!
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <TextInput
            required
            label="First Name"
            placeholder="John"
            size="md"
            key={form.key("first_name")}
            {...form.getInputProps("first_name")}
          />
          <TextInput
            required
            label="Last Name"
            placeholder="Doe"
            size="md"
            key={form.key("last_name")}
            {...form.getInputProps("last_name")}
          />
          <PasswordInput
            required
            label="Password"
            placeholder="New password"
            mt="md"
            size="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm password"
            mt="md"
            size="md"
            key={form.key("confirm_password")}
            {...form.getInputProps("confirm_password")}
          />
          <Button type="submit" fullWidth mt="xl" size="md" disabled={isSigningUp}>
            <LoadingOverlay
              visible={isSigningUp}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            Signup
          </Button>

          <Text ta="center" mt="md">
            Already have an account?{" "}
            <Anchor<"a"> href="#" fw={700} onClick={(event) => event.preventDefault()}>
              Login
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Group>
  );
}

export default Register;
