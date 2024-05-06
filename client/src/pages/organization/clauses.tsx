import { useState } from 'react';
import { Table, Checkbox, Menu, MenuItem, Popover, Button } from '@mantine/core';
import TitleBar from '../../components/title-bar';
import { Link, useParams } from 'react-router-dom';
import { IconDots } from '@tabler/icons-react';

const clauses = [
  { id: 1, name: "No obligation", clauseType: "No obligation", lastModifiedBy: "Someone", lastModifiedOn: "2024-05-05" },
  { id: 2, name: "Participation", clauseType: "Rights", lastModifiedBy: "Someone", lastModifiedOn: "2024-05-05" }
];

function OrganizationClauses() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const params = useParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const handleActionClick = (clauseId: number) => {
    // Implement your action logic here
    console.log(`Action clicked for clause ID ${clauseId}`);
  };

  const actionMenu = (clauseId: number) => (
    <Menu>
      <MenuItem onClick={() => handleActionClick(clauseId)}>Download</MenuItem>
      <MenuItem onClick={() => handleActionClick(clauseId)}>Delete</MenuItem>
    </Menu>
  );

  const rows = clauses.map((clause) => (
    <Table.Tr
      key={clause.name}
      bg={selectedRows.includes(clause.id) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(clause.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, clause.id]
                : selectedRows.filter((position) => position !== clause.id)
            )
          }
        />
      </Table.Td>
      <Table.Td><Link to={`/${organizationId}/${clause.name}`} className="color-blue-800">{clause.name}</Link></Table.Td>
      <Table.Td>{clause.clauseType}</Table.Td>
      <Table.Td>{clause.lastModifiedBy}</Table.Td>
      <Table.Td>{clause.lastModifiedOn}</Table.Td>
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
            {actionMenu(clause.id)}
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TitleBar title="Clause Library" />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Clause Name</Table.Th>
            <Table.Th>Clause Type</Table.Th>
            <Table.Th>Last Modified By</Table.Th>
            <Table.Th>Last Modified On</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}

export default OrganizationClauses;
