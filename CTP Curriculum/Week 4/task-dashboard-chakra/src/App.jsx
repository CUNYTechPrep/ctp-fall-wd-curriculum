import { useState } from 'react'
import { Box, Container, Grid, GridItem, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Statistics from './components/Statistics'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup project', description: 'Initialize React app with Vite', status: 'completed', priority: 'high' },
    { id: 2, title: 'Create components', description: 'Build reusable UI components', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Add styling', description: 'Style components with Chakra UI', status: 'pending', priority: 'medium' },
    { id: 4, title: 'Write tests', description: 'Add unit tests for components', status: 'pending', priority: 'low' }
  ])

  const bgColor = useColorModeValue('gray.50', 'gray.900')

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'pending' }])
  }

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Statistics stats={stats} />

          <Grid
            templateColumns={{ base: '1fr', lg: '400px 1fr' }}
            gap={8}
          >
            <GridItem>
              <Box>
                <Heading size="md" mb={4}>Add New Task</Heading>
                <TaskForm onAddTask={addTask} />
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Heading size="md" mb={4}>Tasks</Heading>
                <TaskList
                  tasks={tasks}
                  onUpdateStatus={updateTaskStatus}
                  onDelete={deleteTask}
                />
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}

export default App