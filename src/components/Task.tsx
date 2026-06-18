import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskProps {
  text: string;
  updateMode: () => void;
  deleteTask: () => void;
}

const Task: React.FC<TaskProps> = ({ text, updateMode, deleteTask }) => {
  return (
    <View className="mt-4 flex-row items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm">
      <Text className="mr-4 flex-1 text-base text-zinc-800">{text}</Text>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity className="p-1" onPress={updateMode} accessibilityRole="button">
          <Feather name="edit" size={20} color="#18181b" />
        </TouchableOpacity>
        <TouchableOpacity className="p-1" onPress={deleteTask} accessibilityRole="button">
          <AntDesign name="delete" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;
