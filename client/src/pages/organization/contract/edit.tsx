import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import TitleBar from "../../../components/title-bar";
import useAuth from "../../../hooks/use-auth";
import type { TemplateWithClause } from "../../../types/contract-type";
import { notifications } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import { IconFilePlus, IconGripVertical, IconTrash } from "@tabler/icons-react";
import type { ClauseResponse, PaginatedClausesResponse } from "../../../types/clause";
import RenderHTML from "../../../components/html-content";
import { useListState } from "@mantine/hooks";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";

function EditContractType() {
  const [showModal, setShowModal] = useState(false);
  const { api } = useAuth();
  const params = useParams();
  const [template, setTemplate] = useState<TemplateWithClause>();
  const [clauses, setClauses] = useState<PaginatedClausesResponse>({
    data: [],
    total_count: 0,
  });
  const [selectedClause, setSelectedClause] = useState<ClauseResponse>();
  const [state, handlers] = useListState<ClauseResponse>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!params.templateId || !params.organizationId) return;

  const { templateId, organizationId } = params;

  const fetchTemplate = useCallback(async () => {
    const { body, status } = await api.getTemplate({
      params: {
        templateId,
      },
    });

    if (status === 200) {
      setTemplate(body);
      handlers.setState(body.clauses);
    } else {
      notifications.show({
        color: "red",
        message: "Failed to fetch contract types",
      });
    }
  }, [api.getTemplate, templateId, handlers.setState]);

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

  const handleSubmit = useCallback(async () => {
    if (!template) return;

    const { status } = await api.updateTemplate({
      body: {
        contract_type: template.contract_type,
        clauses: state,
      },
    });

    if (status === 200) {
      notifications.show({
        title: "Template",
        message: "Updated successfully",
      });
    } else {
      notifications.show({
        color: "red.5",
        title: "Template",
        message: "Failed to update",
      });
    }
  }, [api.updateTemplate, template, state]);

  const items = state.map((item, idx) => (
    <Group
      key={item.id}
      p={8}
      className="hover:bg-gray-200 hover:rounded-md"
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Draggable index={idx} draggableId={item.id}>
        {(provided, _snapshot) => (
          <Stack
            flex={1}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Group pos={"relative"}>
              {hoveredIndex === idx ? (
                <ActionIcon
                  pos={"absolute"}
                  right={10}
                  top={-4}
                  color="red"
                  onClick={() => handlers.remove(idx)}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              ) : undefined}
              <RenderHTML content={item.language} />
            </Group>
          </Stack>
        )}
      </Draggable>
    </Group>
  ));

  const draggableItems = state.map((item, idx) => (
    <Group key={item.id} p={8} className="hover:bg-gray-200 hover:rounded-md">
      <Draggable index={idx} draggableId={item.id}>
        {(provided, _snapshot) => (
          <Stack flex={1} {...provided.draggableProps} ref={provided.innerRef}>
            <Group>
              <Box {...provided.dragHandleProps}>
                <IconGripVertical />
              </Box>
              <Title order={5}>{item.title}</Title>
            </Group>
          </Stack>
        )}
      </Draggable>
    </Group>
  ));

  return (
    <>
      <TitleBar>
        <Text c="white">Edit Template</Text>

        <Button onClick={handleSubmit}>Save</Button>
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
                  disabled={!!state.find((c) => c.id === selectedClause.id)}
                  onClick={() => {
                    handlers.append(selectedClause);
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

      <Group justify="space-between" align="start">
        <Stack w="50%" miw="900px" p="md" gap={16}>
          <Stack gap={0}>
            <Paper withBorder p={18}>
              <Center>
                <Title>{template?.contract_type.name}</Title>
              </Center>
              <DragDropContext
                onDragEnd={({ destination, source }) =>
                  handlers.reorder({ from: source.index, to: destination?.index || 0 })
                }
              >
                <Droppable droppableId="dnd-item-list" direction="vertical">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {items}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Center>
                <Button
                  onClick={() => {
                    setSelectedClause(clauses.data[0]);
                    setShowModal(true);
                  }}
                >
                  <IconFilePlus size="1.5rem" />
                  <span>Add clause</span>
                </Button>
              </Center>
            </Paper>
          </Stack>
        </Stack>

        <Paper withBorder p="md" m="md" miw={400}>
          <DragDropContext
            onDragEnd={({ destination, source }) =>
              handlers.reorder({ from: source.index, to: destination?.index || 0 })
            }
          >
            <Title ta="center" order={3}>
              Clauses
            </Title>

            <Divider my="md" />

            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {draggableItems}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      </Group>
    </>
  );
}

export default EditContractType;
