import { NavLink, Stack, Text } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import type { IconProps } from "@tabler/icons-react";
import type {
  CSSProperties,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactNode,
  RefAttributes,
} from "react";

type TablerIconsProps = Partial<
  ForwardRefExoticComponent<Omit<IconProps, "ref"> & RefAttributes<FunctionComponent<IconProps>>>
> & {
  className?: string;
  size?: string | number;
  stroke?: string | number;
  strokeWidth?: string | number;
  style?: CSSProperties;
};

type Props = Readonly<{
  name: string;
  links: {
    label: string;
    href: string;
    icon: (props: TablerIconsProps) => ReactNode;
  }[];
}>;

export function LinkGroup({ name, links }: Props) {
  {
    const { pathname } = useLocation();
    return (
      <Stack gap={8}>
        <Text size="xs" c="dimmed">
          {name}
        </Text>
        <Stack gap={2}>
          {links.map((l) => (
            <NavLink
              variant="light"
              component={Link}
              key={l.href}
              to={l.href}
              label={l.label}
              active={pathname.includes(l.href.replace(".", ""))}
              fw={500}
              className="rounded-md"
              leftSection={<l.icon className="size-4" />}
            />
          ))}
        </Stack>
      </Stack>
    );
  }
}
