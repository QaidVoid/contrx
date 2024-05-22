import { Avatar, Input, Paper, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { UserPayload } from "../../types/user";
import useAuth from "../../hooks/use-auth";
import { useCallback } from "react";

function PersonalInfo() {
  const form = useForm<UserPayload>({
    mode: "uncontrolled",
    validate: zodResolver(UserPayload)
  });
  const { api } = useAuth();

  const handleSubmit = useCallback(async (data: UserPayload) => {
    const { body, status } = await api.updateProfile({
      body: data
    });

    if (status === 200) {
      
    }
  }, [api.updateProfile]);

  return (
    <Paper>
      <Stack>
        <Avatar />

        <form>
          <TextInput
            label="Email address"
            size="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
        </form>
      </Stack>
    </Paper>
  );
}

export default PersonalInfo;
