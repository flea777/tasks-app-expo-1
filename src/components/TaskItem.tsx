import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskItemProps {
  task: TaskType;
  updateMode: () => void;
  deleteTask: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Alta:  '#ff4466',
  Média: '#ff9800',
  Baixa: '#00ff88',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, updateMode, deleteTask }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
  const priorityColor = task.priority ? PRIORITY_COLORS[task.priority] : null;

  return (
    <View style={[s.card, task.completed && s.cardCompleted]}>
      {/* Barra de prioridade à esquerda */}
      {priorityColor && <View style={[s.priorityBar, { backgroundColor: priorityColor }]} />}

      <View style={s.content}>
        <View style={s.topRow}>
          <Text style={[s.text, task.completed && s.textDone]} numberOfLines={2}>
            {task.text}
          </Text>
          {task.priority && (
            <View style={[s.priorityBadge, { borderColor: priorityColor ?? '#1a1a35' }]}>
              <Text style={[s.priorityBadgeText, { color: priorityColor ?? '#333355' }]}>
                {task.priority.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {task.dueDate && (
          <Text style={[s.date, isOverdue ? s.dateOverdue : s.dateOk]}>
            {isOverdue ? '⚠ Venceu: ' : '⏰ Até: '}
            {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        )}

        {task.completed && <Text style={s.completedTag}>✓ CONCLUÍDA</Text>}
      </View>

      <View style={s.actions}>
        <TouchableOpacity onPress={updateMode} style={s.actionBtn} accessibilityRole="button">
          <Feather name="edit-2" size={16} color="#00d4ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTask} style={[s.actionBtn, s.deleteBtn]} accessibilityRole="button">
          <AntDesign name="delete" size={16} color="#ff4466" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: '#0a0a1a',
    borderWidth: 1,
    borderColor: '#1a1a35',
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardCompleted: {
    borderColor: '#00ff8820',
    opacity: 0.75,
  },
  priorityBar: {
    width: 3,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  text: {
    color: '#e0e0ff',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#333355',
  },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priorityBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  date: {
    fontSize: 11,
    marginTop: 5,
    fontWeight: '600',
  },
  dateOverdue: { color: '#ff4466' },
  dateOk:      { color: '#00d4ff' },
  completedTag: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: '700',
    color: '#00ff88',
    letterSpacing: 2,
  },
  actions: {
    flexDirection: 'row',
    paddingRight: 12,
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,212,255,0.08)',
    borderWidth: 1,
    borderColor: '#1a1a35',
  },
  deleteBtn: {
    backgroundColor: 'rgba(255,68,102,0.08)',
  },
});

export default TaskItem;
