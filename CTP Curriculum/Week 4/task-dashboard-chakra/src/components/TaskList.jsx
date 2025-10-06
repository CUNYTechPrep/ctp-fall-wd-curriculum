import { VStack, Text, Box, useColorModeValue } from '@chakra-ui/react'
import TaskCard from './TaskCard'

function TaskList({ tasks, onUpdateStatus, onDelete }) {
  const emptyBg = useColorModeValue('gray.100', 'gray.800')

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  if (sortedTasks.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg={emptyBg}
        borderRadius="lg"
      >
        <Text color="gray.500">
          No tasks yet. Add one to get started!
        </Text>
      </Box>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </VStack>
  )
}

export default TaskList