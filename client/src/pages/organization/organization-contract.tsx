import { useState } from "react";
import { Table, Checkbox, Menu, MenuItem, Popover, Button, Text } from "@mantine/core";
import TitleBar from "../../components/title-bar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IconDots } from "@tabler/icons-react";
import CreateContractType from "./contract/create";

const contractTypes = [
  {
    id: 1,
    name: "Reseller Agreement",
    status: "Published",
    lastModifiedBy: "Someone",
    lastModifiedOn: "2024-05-05",
  },
  {
    id: 2,
    name: "Data Sharing Agreement",
    status: "Draft",
    lastModifiedBy: "Someone",
    lastModifiedOn: "2024-05-05",
  },
];

function OrganizationContract() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  if (!params.organizationId) return;

  const organizationId = params.organizationId;

  return (
    <>
      <TitleBar>
        <Text c="white">Contract Types</Text>

        <Button bg="blue.6" onClick={() => navigate(`/${organizationId}/contract/new`)}>
          Create Contract
        </Button>
      </TitleBar>
    </>
  );
}

export default OrganizationContract;
