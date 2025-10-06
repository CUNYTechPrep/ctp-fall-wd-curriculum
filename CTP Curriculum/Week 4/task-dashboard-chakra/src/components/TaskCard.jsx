import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Select,
  IconButton,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

function TaskCard({ task, onUpdateStatus, onDelete }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green'
      case 'in-progress': return 'yellow'
      case 'pending': return 'gray'
      default: return 'gray'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'blue'
      default: return 'gray'
    }
  }

  const handleStatusChange = (e) => {
    onUpdateStatus(task.id, e.target.value)
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="md"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.3s"
    >
      <Flex justify="space-between" align="flex-start" mb={3}>
        <Box flex="1">
          <Heading size="md" mb={2}>
            {task.title}
          </Heading>
          <HStack spacing={2} mb={3}>
            <Badge colorScheme={getStatusColor(task.status)} variant="subtle">
              {task.status.replace('-', ' ')}
            </Badge>
            <Badge colorScheme={getPriorityColor(task.priority)} variant="solid">
              {task.priority}
            </Badge>
          </HStack>
        </Box>
      </Flex>

      {task.description && (
        <Text color="gray.600" mb={4}>
          {task.description}
        </Text>
      )}

      <Flex gap={3} align="center">
        <Select
          value={task.status}
          onChange={handleStatusChange}
          size="sm"
          flex="1"
          focusBorderColor="teal.400"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        <IconButton
          icon={<DeleteIcon />}
          onClick={() => onDelete(task.id)}
          colorScheme="red"
          variant="outline"
          size="sm"
          aria-label="Delete task"
        />
      </Flex>
    </Box>
  )
}

export default TaskCard