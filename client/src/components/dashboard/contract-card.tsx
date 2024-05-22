import { Paper, Stack, Text } from "@mantine/core";

type Props = {
  title: string;
  message: string | number;
};

function ContractCard({ title, message } : Props) {
  return (
    <Paper withBorder>
      <Stack gap={16} p="md">
        <Text size="xl" fw="bold">{title}</Text>
        <Text>{message}</Text>
      </Stack>
    </Paper>
  );
}

export default ContractCard;
