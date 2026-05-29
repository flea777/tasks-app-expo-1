import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskListProps {
  tasks: TaskType[];
  onUpdate: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  const sections = useMemo(() => {
    const completed = tasks.filter((t) => t.completed);
    const pending   = tasks.filter((t) => !t.completed);
    return [
      { title: 'PENDENTES',  accent: '#ff9800', data: pending   },
      { title: 'CONCLUÍDAS', accent: '#00ff88', data: completed },
    ];
  }, [tasks]);

  return (
    <View style={s.wrap}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={s.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) =>
          section.data.length === 0 ? null : (
            <View style={s.sectionHeader}>
              <View style={[s.sectionDot, { backgroundColor: section.accent }]} />
              <Text style={[s.sectionTitle, { color: section.accent }]}>{section.title}</Text>
              <View style={s.sectionLine} />
              <Text style={s.sectionCount}>{section.data.length}</Text>
            </View>
          )
        }
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <View style={s.emptySection}>
              <Text style={s.emptyText}>Nenhuma tarefa aqui.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            updateMode={() => onUpdate(item)}
            deleteTask={() => onDelete(item._id)}
          />
        )}
      />
    </View>
  );
};

const s = StyleSheet.create({
  wrap: { flex: 1, marginTop: 8 },
  listContent: { paddingBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: { fontSize: 9, fontWeight: '900', letterSpacing: 3 },
  sectionLine: { flex: 1, height: 1, backgroundColor: '#1a1a35' },
  sectionCount: { color: '#333355', fontSize: 10, fontWeight: '700' },
  emptySection: { paddingVertical: 12, alignItems: 'center' },
  emptyText: { color: '#252540', fontSize: 12, fontStyle: 'italic' },
});

export default TaskList;
