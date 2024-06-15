import React, { useState, useRef } from 'react';
import {
    ChakraProvider,
    extendTheme,
    Box,
    Text,
    Button,
    HStack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { WarningIcon } from '@chakra-ui/icons';
import StepperWithSubStepCounter from '../components/StepperWithSubStepCounter';

const theme = extendTheme({
    colors: {
        navy: '#0A1128',
        gray: {
            200: '#e2e8f0',
            500: '#718096',
        },
        white: '#FFFFFF',
        orange: '#FF8C00',
        green: {
            400: '#38A169',
        },
        blue: {
            400: '#3182CE',
        },
    },
});

const ESGPreference: React.FC = () => {
    const [esgPreference, setEsgPreference] = useState<string | undefined>(undefined);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const onClose = () => setIsAlertOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    const handleNext = () => {
        if (esgPreference !== undefined) {
            navigate('/nombre-enfants-a-charge'); 
        } else {
            setIsAlertOpen(true);
        }
    };

    return (
        <ChakraProvider theme={theme}>
            <StepperWithSubStepCounter currentStep={1} currentSubStep={7} totalSubSteps={24} title="Préférence pour les investissements ESG" />
            <Box p={5} maxW="1000px" mx="auto">
                <Text fontSize="xl" fontWeight="bold" mb={5} textAlign="center">
                    Avez-vous une préférence pour des investissements respectant les critères environnementaux, sociaux et de gouvernance (ESG) ?
                </Text>
                <Text fontSize="md" textAlign="center" mb={6}>
                    L’ESG est un ensemble de critères utilisés pour évaluer les pratiques durables et socialement responsables des entreprises. Cela inclut des facteurs tels que l'impact environnemental, les relations avec les employés et la qualité de la gouvernance.
                </Text>
                <HStack justifyContent="center" spacing="4">
                    <Button
                        variant="outline"
                        colorScheme={esgPreference === 'ESG' ? 'green' : 'gray'}
                        borderColor={esgPreference === 'ESG' ? 'green.400' : 'gray.200'}
                        onClick={() => setEsgPreference('ESG')}
                        px={10}
                        py={6}
                        size="lg"
                        _hover={{ bg: 'gray.200' }}
                    >
                        Préférence ESG
                    </Button>
                    <Button
                        variant="outline"
                        colorScheme={esgPreference === 'Non-ESG' ? 'blue' : 'gray'}
                        borderColor={esgPreference === 'Non-ESG' ? 'blue.400' : 'gray.200'}
                        onClick={() => setEsgPreference('Non-ESG')}
                        px={10}
                        py={6}
                        size="lg"
                        _hover={{ bg: 'gray.200' }}
                    >
                        Pas de préférence ESG
                    </Button>
                </HStack>

                <HStack justifyContent="flex-end" mt="8" spacing="4">
                    <Button
                        colorScheme="gray"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        px={6}
                        py={6}
                        size="lg"
                    >
                        Retour
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={handleNext}
                        px={6}
                        py={6}
                        size="lg"
                    >
                        Suivant
                    </Button>
                </HStack>
            </Box>

            <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <WarningIcon color="orange" mr={2} />
                            Sélection requise
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Veuillez sélectionner une option avant de continuer. 😊
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </ChakraProvider>
    );
};

export default ESGPreference;
