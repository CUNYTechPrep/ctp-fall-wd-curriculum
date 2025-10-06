import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Container,
  useColorMode,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Container maxW="container.xl">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size="lg" color="teal.500">
            Task Dashboard
          </Heading>

          <HStack spacing={4}>
            <HStack
              spacing={6}
              display={{ base: 'none', md: 'flex' }}
            >
              <Link
                px={2}
                py={1}
                rounded="md"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                fontWeight="medium"
                color="teal.500"
              >
                Dashboard
              </Link>
              <Link
                px={2}
                py={1}
                rounded="md"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              >
                Projects
              </Link>
              <Link
                px={2}
                py={1}
                rounded="md"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              >
                Team
              </Link>
              <Link
                px={2}
                py={1}
                rounded="md"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              >
                Settings
              </Link>
            </HStack>

            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header