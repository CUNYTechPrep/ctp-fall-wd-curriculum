import { SimpleGrid, Stat, StatLabel, StatNumber, Box, useColorModeValue } from '@chakra-ui/react'

function Statistics({ stats }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const statCards = [
    { label: 'Total Tasks', value: stats.total, colorScheme: 'blue' },
    { label: 'Completed', value: stats.completed, colorScheme: 'green' },
    { label: 'In Progress', value: stats.inProgress, colorScheme: 'yellow' },
    { label: 'Pending', value: stats.pending, colorScheme: 'gray' },
  ]

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
      {statCards.map((stat, index) => (
        <Box
          key={index}
          bg={bgColor}
          p={5}
          borderRadius="lg"
          borderLeft="4px"
          borderLeftColor={`${stat.colorScheme}.400`}
          shadow="md"
          _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
          transition="all 0.3s"
        >
          <Stat>
            <StatLabel color={`${stat.colorScheme}.600`} fontSize="sm">
              {stat.label}
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">
              {stat.value}
            </StatNumber>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default Statistics