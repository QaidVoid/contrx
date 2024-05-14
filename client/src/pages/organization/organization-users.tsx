import { Tabs, Text } from "@mantine/core";
import TitleBar from "../../components/title-bar";
import { useParams } from "react-router-dom";
import OrganizationUsersList from "../../components/organization-users-list";

function OrganizationUsers() {
  const params = useParams();

  if (!params.organizationId) return;

  const { organizationId } = params;

  return (
    <>
      <TitleBar>
        <Text c="white">Users</Text>
      </TitleBar>

      <Tabs defaultValue="active">
        <Tabs.List>
          <Tabs.Tab value="active">Active</Tabs.Tab>
          <Tabs.Tab value="invited">Invited</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="active">
          <OrganizationUsersList organizationId={organizationId} status="active" />
        </Tabs.Panel>
        <Tabs.Panel value="invited">
          <OrganizationUsersList organizationId={organizationId} status="invited" />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default OrganizationUsers;
