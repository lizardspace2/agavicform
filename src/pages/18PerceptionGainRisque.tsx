import React, { useState, useRef } from 'react';
import {
    ChakraProvider,
    extendTheme,
    Box,
    Text,
    Button,
    VStack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
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

const perceptionOptions = [
    { value: 'vrai', label: 'Vrai' },
    { value: 'faux', label: 'Faux' },
    { value: 'jeNeSaisPas', label: 'Je ne sais pas' },
];

const PerceptionGainRisque: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const onClose = () => setIsAlertOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    const handleSelect = (value: string) => {
        setSelectedOption(value);
    };

    const handleNext = () => {
        if (selectedOption !== undefined) {
            navigate('/etf-capital-garanti'); 
        } else {
            setIsAlertOpen(true);
        }
    };

    return (
        <ChakraProvider theme={theme}>
            <StepperWithSubStepCounter currentStep={1} currentSubStep={18} totalSubSteps={24} title='"Une perspective de gain élevé implique un risque de perte en capital fort"' />
            <Box p={5} maxW="1000px" mx="auto">
                <Text fontSize="xl" fontWeight="bold" mb={5} textAlign="center">
                    "Une perspective de gain élevé implique un risque de perte en capital fort"
                </Text>
                <Text fontSize="md" textAlign="center" mb={6}>
                    L'affirmation ci-dessus vous semble-t-elle vraie ?
                </Text>
                <VStack spacing={4} align="stretch">
                    {perceptionOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant="outline"
                            size="lg"
                            colorScheme={selectedOption === option.value ? 'green' : 'gray'}
                            onClick={() => handleSelect(option.value)}
                            px={10}
                            py={6}
                            textAlign="center"
                            _hover={{ bg: 'gray.200' }}
                            borderColor={selectedOption === option.value ? 'green.400' : 'gray.200'}
                        >
                            {option.label}
                        </Button>
                    ))}
                </VStack>

                {(selectedOption === 'faux' || selectedOption === 'jeNeSaisPas') && (
                    <Box mt={8}>
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Box flex="1">
                                <AlertTitle>Réponse :</AlertTitle>
                                <AlertDescription>
                                    En fait, les placements financiers, c'est comme le football, plus vous jouez l'attaque et plus vous vous exposez. Plus vous visez haut, plus vous risquez gros.
                                </AlertDescription>
                            </Box>
                        </Alert>
                    </Box>
                )}

                {selectedOption === 'vrai' && (
                    <Box mt={8}>
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <Box flex="1">
                                <AlertTitle>Félicitations :</AlertTitle>
                                <AlertDescription>
                                    Vous avez bien compris le principe du risque et du gain dans les investissements financiers.
                                </AlertDescription>
                            </Box>
                        </Alert>
                    </Box>
                )}

                <Box mt={8} display="flex" justifyContent="space-between">
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
                </Box>
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

export default PerceptionGainRisque;