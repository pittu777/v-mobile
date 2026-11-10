import { Button } from '@/components/ui/button';
import { Input as TextInput } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { View } from 'react-native';

type Props = {
  onAddTodo: (title: string) => Promise<boolean>;
  saving: boolean;
};

const Input = ({ onAddTodo, saving }: Props) => {
  const [text, setText] = useState('');

  const submitTodo = async () => {
    const title = text.trim();
    if (!title || saving) return;
    if (await onAddTodo(title)) setText('');
  };

  return (
    <View className="w-full max-w-[480px] self-center px-4 pt-8">
      <Text variant="headline" className="text-left">
        My tasks
      </Text>

      <View className="mt-6 flex-row items-center gap-3">
        <TextInput
          className="flex-1"
          placeholder="Add a task"
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => void submitTodo()}
          returnKeyType="done"
          accessibilityLabel="New task"
          accessibilityHint="Type a task and submit to add it to your list"
        />
        <Button
          onPress={() => void submitTodo()}
          disabled={!text.trim() || saving}
          accessibilityLabel="Add task"
        >
          <Text>{saving ? 'Adding…' : 'Add'}</Text>
        </Button>
      </View>
    </View>
  );
};

export default Input;
