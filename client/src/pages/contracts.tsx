import { Text } from "@mantine/core";
import CreateContractForm from "../components/create-contract-form";
import TitleBar from "../components/title-bar";

function Contracts() {
  return (
    <TitleBar>
      <Text c="white">Contracts</Text>
      <CreateContractForm />
    </TitleBar>
  );
}

export default Contracts;
