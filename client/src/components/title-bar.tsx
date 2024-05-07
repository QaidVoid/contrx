import { Group, Text } from "@mantine/core";
import type { PropsWithChildren } from "react";


function TitleBar({ children }: PropsWithChildren) {
  return (
    <Group w="100%" bg="blue.6" p={18}>
        {children}
    </Group>
  );
}

export default TitleBar;
