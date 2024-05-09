import { useState } from 'react';
import { Table, Checkbox, Menu, MenuItem, Popover, Button, Text } from '@mantine/core';
import TitleBar from '../../components/title-bar';
import { Link, useParams } from 'react-router-dom';
import { IconDots } from '@tabler/icons-react';

const templates = [
  { id: 1, name: "Termination Letter", lastModifiedBy: "Someone", lastModifiedOn: "2024-05-05" },
  { id: 2, name: "Renewal Letter", lastModifiedBy: "Someone", lastModifiedOn: "2024-05-05" }
];

function OrganizationTemplates() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const params = useParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const handleActionClick = (templateId: number) => {
    // Implement your action logic here
    console.log(`Action clicked for clause ID ${templateId}`);
  };

  const actionMenu = (templateId: number) => (
    <Menu>
      <MenuItem onClick={() => handleActionClick(templateId)}>Download</MenuItem>
      <MenuItem onClick={() => handleActionClick(templateId)}>Delete</MenuItem>
    </Menu>
  );

  const rows = templates.map((template) => (
    <Table.Tr
      key={template.name}
      bg={selectedRows.includes(template.id) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(template.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, template.id]
                : selectedRows.filter((position) => position !== template.id)
            )
          }
        />
      </Table.Td>
      <Table.Td><Link to={`/${organizationId}/${template.name}`} className="color-blue-800">{template.name}</Link></Table.Td>
      <Table.Td>{template.lastModifiedBy}</Table.Td>
      <Table.Td>{template.lastModifiedOn}</Table.Td>
      <Table.Td>
        <Popover
          position="bottom"
          withArrow
        >
          <Popover.Target>
            <Button size="xs">
              <IconDots />
            </Button>
          </Popover.Target>

          <Popover.Dropdown>
            {actionMenu(template.id)}
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TitleBar>
        <Text c="white">Contract Letters</Text>
      </TitleBar>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Name</Table.Th>
            <Table.Th>Last Modified By</Table.Th>
            <Table.Th>Last Modified On</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}

export default OrganizationTemplates;
