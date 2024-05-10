import { useAutoAnimate } from "@formkit/auto-animate/react";
import { usePagination } from "@mantine/hooks";
import { DataTable, type DataTableProps } from "mantine-datatable";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

type Props<T> = WithRequiredProperty<DataTableProps<T>, "records" | "columns"> & {
  fetching: boolean;
  totalCount: number;
  fetcher: () => void;
};

function Table<T>({ fetcher, fetching, totalCount, records, columns, ...props }: Props<T>) {
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const page = searchParams.get("page") ?? 1;
    return Number(page) ?? 1;
  }, [searchParams]);

  const { setPage } = usePagination({
    initialPage: 1,
    page: page,
    total: totalCount,
    onChange: (page) => {
      setSearchParams({ page: page.toString() });
      fetcher();
    },
  });

  return (
    <DataTable
      bodyRef={bodyRef}
      minHeight={totalCount < 1 ? 200 : 120}
      withTableBorder
      striped
      {...props}
      columns={[...columns]}
      records={records}
      totalRecords={totalCount}
      fetching={fetching}
      page={page}
      recordsPerPage={10}
      onPageChange={setPage}
      noRecordsText="No records to show"
    />
  );
}

export default Table;
