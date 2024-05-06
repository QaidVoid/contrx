import { Group, Text } from "@mantine/core";

type Props = {
  title: string;
};

function TitleBar({ title }: Props) {
  return (
    <Group bg="blue.6" p={18}>
      <Text c="white">{title}</Text>
    </Group>
  );
}

export default TitleBar;
