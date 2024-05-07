import { useCallback, useEffect, useState } from 'react';
import { Table, Checkbox, Menu, MenuItem, Popover, Button, Group, Text } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { IconDots } from '@tabler/icons-react';
import CreateClauseForm from '../../components/create-clause-form';
import useAuth from '../../hooks/use-auth';
import { notifications } from '@mantine/notifications';
import { ClausesResponse } from '../../types/clause';

function OrganizationClauses() {
  const { api } = useAuth();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const params = useParams();
  const [clauses, setClauses] = useState<ClausesResponse>([]);

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  const fetchClauses = useCallback(async () => {
    const { body, status } = await api.getClauses({
      params: {
        organizationId
      }
    });

    if (status === 200) {
      setClauses(body);
    } else {
      notifications.show({
        color: "red",
        message: "Invalid organization"
      })
    }
  }, [organizationId, api.getOrganization]);

  useEffect(() => {
    fetchClauses();
  }, []);

  const handleActionClick = (clauseId: string) => {
    // Implement your action logic here
    console.log(`Action clicked for clause ID ${clauseId}`);
  };

  const actionMenu = (clauseId: string) => (
    <Menu>
      <MenuItem onClick={() => handleActionClick(clauseId)}>Download</MenuItem>
      <MenuItem onClick={() => handleActionClick(clauseId)}>Delete</MenuItem>
    </Menu>
  );

  const rows = clauses?.map((clause) => (
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
      <Table.Td>{clause.type}</Table.Td>
      <Table.Td>{clause.last_modified_by}</Table.Td>
      <Table.Td>{clause.last_modified_at}</Table.Td>
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
      <Group bg="green.6" p={18} justify='space-between'>
        <Text c="white">Clause Library</Text>
        <CreateClauseForm organizationId={organizationId} />
      </Group>
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
