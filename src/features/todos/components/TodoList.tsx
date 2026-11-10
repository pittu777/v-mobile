import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FlatList, View } from 'react-native';
import { ListTodo } from 'lucide-react-native';
import type { Todo } from '../todo';

type Props = {
  todos: Todo[];
  loading: boolean;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
};

function TodoSkeleton() {
  return (
    <View className="gap-3" accessibilityLabel="Loading todos">
      {[0, 1, 2].map((item) => (
        <View
          key={item}
          className="h-[68px] flex-row items-center gap-3 rounded-md border border-border bg-card px-4"
        >
          <View className="size-4 rounded-[4px] bg-muted" />
          <View className="h-4 flex-1 rounded-sm bg-muted" />
          <View className="h-11 w-[72px] rounded-md bg-muted" />
        </View>
      ))}
    </View>
  );
}

function EmptyTodos() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Icon as={ListTodo} size={28} className="text-muted-foreground" />
      <Text variant="title" className="mt-4 text-center">
        No todos yet
      </Text>
      <Text variant="muted" className="mt-2 text-center">
        Add one above to get started.
      </Text>
    </View>
  );
}

const TodoList = ({ todos, loading, onToggleTodo, onDeleteTodo }: Props) => {
  return (
    <View className="mt-6 w-full max-w-[480px] flex-1 self-center px-4">
      <FlatList
        data={todos}
        className="flex-1"
        contentContainerClassName={todos.length === 0 ? 'flex-1' : 'pb-6'}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? <TodoSkeleton /> : <EmptyTodos />}
        renderItem={({ item }) => (
          <View className="mb-3 min-h-[68px] w-full flex-row items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-sm shadow-black/5">
            <View className="min-w-0 flex-1 flex-row items-center gap-2">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => onToggleTodo(item._id)}
                accessibilityLabel={`Mark ${item.title} ${item.completed ? 'incomplete' : 'complete'}`}
              />
              <Text
                className={`min-w-0 flex-1 text-body ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                accessibilityRole="text"
              >
                {item.title}
              </Text>
            </View>

            <Button
              variant="destructive"
              size="sm"
              className="px-3"
              onPress={() => onDeleteTodo(item._id)}
              accessibilityLabel={`Delete ${item.title}`}
            >
              <Text>Delete</Text>
            </Button>
          </View>
        )}
      />
    </View>
  );
};

export default TodoList;
