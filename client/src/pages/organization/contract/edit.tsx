import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  Divider,
  Group,
  List,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import TitleBar from "../../../components/title-bar";
import useAuth from "../../../hooks/use-auth";
import { TemplateWithClausePayload, type TemplateWithClause } from "../../../types/contract-type";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import { IconFilePlus, IconTrash } from "@tabler/icons-react";
import type { ClauseResponse, PaginatedClausesResponse } from "../../../types/clause";
import RenderHTML from "../../../components/html-content";

function EditContractType() {
  const [showModal, setShowModal] = useState(false);
  const { api } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [template, setTemplate] = useState<TemplateWithClause>();
  const [clauses, setClauses] = useState<PaginatedClausesResponse>({
    data: [],
    total_count: 0,
  });
  const [selectedClause, setSelectedClause] = useState<ClauseResponse>();

  if (!params.templateId || !params.organizationId) return;

  const { templateId, organizationId } = params;

  const form = useForm<TemplateWithClausePayload>({
    mode: "uncontrolled",
    validate: zodResolver(TemplateWithClausePayload),
  });

  useEffect(() => {
    if (template && !form.initialized) {
      form.initialize(template);
    }
  }, [template, form.initialize, form.initialized]);

  const fetchTemplate = useCallback(async () => {
    const { body, status } = await api.getTemplate({
      params: {
        templateId,
      },
    });

    if (status === 200) {
      setTemplate(body);
    } else {
      notifications.show({
        color: "red",
        message: "Failed to fetch contract types",
      });
    }
  }, [api.getTemplate, templateId]);

  const fetchClauses = useCallback(async () => {
    const { body, status } = await api.getClauses({
      params: {
        organizationId,
      },
      query: {
        page: 1,
        size: 100,
      },
    });

    if (status === 200) {
      setClauses(body);
    }
  }, [api.getClauses, organizationId]);

  const fetchClause = useCallback(
    async (clauseId: string) => {
      const { body, status } = await api.getClause({
        params: {
          clauseId,
        },
      });

      if (status === 200) {
        setSelectedClause(body);
      }
    },
    [api.getClause],
  );

  useEffect(() => {
    fetchTemplate();
    fetchClauses();
  }, [fetchTemplate, fetchClauses]);

  const handleSubmit = useCallback(async (data: any) => {
    console.log(data);
  }, []);

  if (!form.initialized) return;

  const fields = form.getValues().clauses.map((item, idx) => (
    <Group key={item.id} mt="xs">
      <Stack flex={1}>
        <TextInput
          hidden
          placeholder="Clause"
          style={{ flex: 1 }}
          key={form.key(`clauses.${idx}.id`)}
          {...form.getInputProps(`clauses.${idx}.id`)}
        />

        <Paper withBorder p={18}>
          <Stack>
            <Text fw="bold">{item.title}</Text>
            <RenderHTML content={item.language} />
          </Stack>
        </Paper>
      </Stack>

      <ActionIcon color="red" onClick={() => form.removeListItem("clauses", idx)}>
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <>
      <TitleBar>
        <Text c="white">Edit Template</Text>
      </TitleBar>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        fullScreen
        title="Select Clause"
        styles={{ title: { fontSize: "18px" } }}
      >
        <AppShell
          navbar={{
            width: 180,
            breakpoint: "xs",
          }}
          footer={{
            height: 60,
          }}
        >
          <AppShell.Navbar>
            <Stack gap={8}>
              {clauses.data.map((clause) => (
                <Button variant="subtle" key={clause.id} onClick={() => fetchClause(clause.id)}>
                  {clause.title}
                </Button>
              ))}
            </Stack>
          </AppShell.Navbar>

          <AppShell.Main>
            {selectedClause && (
              <>
                <Group bg="blue.6" p={18} justify="space-between">
                  <Text c="white">{selectedClause.title}</Text>
                </Group>

                <Divider />

                <Paper withBorder p={18}>
                  <RenderHTML content={selectedClause.language} />
                </Paper>
              </>
            )}
          </AppShell.Main>

          <AppShell.Footer>
            <Group h="100%" w="100%" justify="end" align="center" px="md">
              {selectedClause && (
                <Button
                  onClick={() => {
                    form.insertListItem("clauses", selectedClause);
                    setShowModal(false);
                  }}
                >
                  Confirm Selection
                </Button>
              )}
            </Group>
          </AppShell.Footer>
        </AppShell>
      </Modal>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack p="md" gap={16}>
          {fields}

          <Button onClick={() => setShowModal(true)}>
            <IconFilePlus size="1.5rem" />
            <span>Add clause</span>
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default EditContractType;
