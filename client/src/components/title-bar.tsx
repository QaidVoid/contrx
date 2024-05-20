import { Group } from "@mantine/core";
import type { PropsWithChildren } from "react";

function TitleBar({ children }: PropsWithChildren) {
  return (
    <Group bg="blue.8" p={18} justify="space-between">
      {children}
    </Group>
  );
}

export default TitleBar;
