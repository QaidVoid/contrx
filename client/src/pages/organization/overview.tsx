import { Grid, Text } from "@mantine/core";
import TitleBar from "../../components/title-bar";
import ContractCard from "../../components/dashboard/contract-card";

function Overview() {
  return (
    <>
      <TitleBar>
        <Text c="white">Overview</Text>
      </TitleBar>

      <Grid p="md">
        <Grid.Col span={{ base: 6, xs: 3 }}>
          <ContractCard title="Active Contracts" message={10} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 3 }}>
          <ContractCard title="Active Contracts" message={10} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 3 }}>
          <ContractCard title="Active Contracts" message={10} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 3 }}>
          <ContractCard title="Active Contracts" message={10} />
        </Grid.Col>
      </Grid>
    </>
  );
}

export default Overview;
