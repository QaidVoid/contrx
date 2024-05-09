import { useState } from 'react';
import { Table, Checkbox, Menu, MenuItem, Popover, Button, Text } from '@mantine/core';
import TitleBar from '../../components/title-bar';
import { Link, useParams } from 'react-router-dom';
import { IconDots } from '@tabler/icons-react';

const contractTypes = [
  { id: 1, name: "Reseller Agreement", status: "Published", lastModifiedBy: "Someone", lastModifiedOn: "2024-05-05" },
  { id: 2, name: "Data Sharing Agreement", status: "Draft", lastModifiedBy: "Someone", lastModifiedOn: "2024-05-05" }
];

function OrganizationContract() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const params = useParams();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const handleActionClick = (contractTypeId: number) => {
    // Implement your action logic here
    console.log(`Action clicked for clause ID ${contractTypeId}`);
  };

  const actionMenu = (contractTypeId: number) => (
    <Menu>
      <MenuItem onClick={() => handleActionClick(contractTypeId)}>Download</MenuItem>
      <MenuItem onClick={() => handleActionClick(contractTypeId)}>Delete</MenuItem>
    </Menu>
  );

  const rows = contractTypes.map((contractType) => (
    <Table.Tr
      key={contractType.name}
      bg={selectedRows.includes(contractType.id) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(contractType.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, contractType.id]
                : selectedRows.filter((position) => position !== contractType.id)
            )
          }
        />
      </Table.Td>
      <Table.Td><Link to={`/${organizationId}/contract-type/${contractType.name}`} className="color-blue-800">{contractType.name}</Link></Table.Td>
      <Table.Td>{contractType.status}</Table.Td>
      <Table.Td>{contractType.lastModifiedBy}</Table.Td>
      <Table.Td>{contractType.lastModifiedOn}</Table.Td>
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
            {actionMenu(contractType.id)}
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TitleBar>
        <Text c="white">Contract Types</Text>
      </TitleBar>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Last Modified By</Table.Th>
            <Table.Th>Last Modified On</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}

export default OrganizationContract;


