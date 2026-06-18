import React from 'react';
import { View } from 'react-native';
import { Heading, Text } from '@gluestack-ui/themed';

export default function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Heading size="lg" style={{ color: '#27272a', textAlign: 'center' }}>
        Nenhuma tarefa encontrada
      </Heading>
      <Text style={{ color: '#71717a', marginTop: 8, textAlign: 'center' }}>
        Adicione uma nova tarefa para começar a organizar sua lista.
      </Text>
    </View>
  );
}
