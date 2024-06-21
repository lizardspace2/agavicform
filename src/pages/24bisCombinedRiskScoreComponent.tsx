import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Progress, VStack } from '@chakra-ui/react';
import { useUuid } from '../context/UuidContext';
import { supabase } from '../supabaseClient';

interface Response {
  step1: string;
  step4: number;
  step9: string;
  step10: string;
  step13: number;
  step14: number;
  step15: string;
  step16: string;
  step17: string;
  step18: string;
  step19: string;
  step20: string;
  step21: string;
  step22: string;
  step23: string;
  step24: string;
}

const calculateRiskScore = (response: Response): number => {
  let score = 0;

  // Normalize each step's response to a 0-1 scale
  const step1Scores: { [key: string]: number } = {
    fructifier: 1,
    epargner: 0,
    achat: 0.625,
    retraite: 0.375,
    patrimoine: 0.5,
    compte: 0.75,
    tresorerie: 0.875,
  };
  score += step1Scores[response.step1];

  score += Math.min(response.step4 / 30, 1); // Normalize step4 to 0-1 based on a maximum of 30 years

  const step9Scores: { [key: string]: number } = {
    lessThan30000: 0,
    '30000to45000': 0.25,
    '45000to60000': 0.5,
    '60000to100000': 0.75,
    '100000to150000': 0.875,
    moreThan150000: 1,
  };
  score += step9Scores[response.step9];

  const step10Scores: { [key: string]: number } = {
    oui: 1,
    non: 0.5,
  };
  score += step10Scores[response.step10];

  score += Math.min(response.step13 / 1000000, 1); // Normalize step13 to 0-1 based on a max value of 1,000,000
  score += Math.min(response.step14 / 10000, 1); // Normalize step14 to 0-1 based on a max value of 10,000

  const step15And16Scores: { [key: string]: number } = {
    certainementPas: 0,
    probablementPas: 0.25,
    probablement: 0.5,
    tresProbablement: 1,
  };
  score += step15And16Scores[response.step15];
  score += step15And16Scores[response.step16];

  const step17Scores: { [key: string]: number } = {
    oui: 1,
    non: 0.5,
  };
  score += step17Scores[response.step17];

  const perceptionScores: { [key: string]: number } = {
    vrai: 1,
    faux: 0,
    jeNeSaisPas: 0.5,
  };
  score += perceptionScores[response.step18];
  score += perceptionScores[response.step19];
  score += perceptionScores[response.step20];

  const step21Scores: { [key: string]: number } = {
    noLoss: 0,
    max10: 0.33,
    max20: 0.66,
    moreThan20: 1,
  };
  score += step21Scores[response.step21];

  const gainLossScores: { [key: string]: number } = {
    gain5000loss2000: 1,
    gain2000loss1000: 0.75,
    gain1000loss400: 0.5,
    gain500noloss: 0.25,
    gain20loss5: 0.25,
    gain30loss10: 0.5,
    gain50loss15: 0.75,
    gain70lossMore15: 1,
  };
  score += gainLossScores[response.step22];
  score += gainLossScores[response.step23];

  const investmentActionScores: { [key: string]: number } = {
    reinvest: 1,
    wait: 0.75,
    sellPart: 0.5,
    sellAll: 0.25,
    dontKnow: 0.25,
  };
  score += investmentActionScores[response.step24];

  // Average the score
  const numberOfSteps = Object.keys(response).length;
  const averageScore = score / numberOfSteps;

  // Normalize to 1-10 scale
  const normalizedScore = Math.round(averageScore * 10);

  return Math.max(1, Math.min(normalizedScore, 10)); // Ensure score is between 1 and 10
};

const CombinedRiskScoreComponent: React.FC = () => {
  const { uuid } = useUuid();
  const [response, setResponse] = useState<Response | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      const { data, error } = await supabase
        .from('form_responses')
        .select(
          'step1, step4, step9, step10, step13, step14, step15, step16, step17, step18, step19, step20, step21, step22, step23, step24'
        )
        .eq('id', uuid)
        .single();

      if (error) {
        console.error('Error fetching responses:', error);
        return;
      }

      if (data) {
        const parsedData: Response = {
          step1: data.step1,
          step4: parseInt(data.step4, 10),
          step9: data.step9,
          step10: data.step10,
          step13: parseInt(data.step13, 10),
          step14: parseInt(data.step14, 10),
          step15: data.step15,
          step16: data.step16,
          step17: data.step17,
          step18: data.step18,
          step19: data.step19,
          step20: data.step20,
          step21: data.step21,
          step22: data.step22,
          step23: data.step23,
          step24: data.step24,
        };

        setResponse(parsedData);
      }
    };

    fetchResponses();
  }, [uuid]);

  if (!response) {
    return <Text>Loading...</Text>;
  }

  const riskScore = calculateRiskScore(response);

  const getColor = (score: number) => {
    if (score <= 2) return 'green.400';
    if (score <= 4) return 'yellow.400';
    if (score <= 6) return 'orange.400';
    if (score <= 8) return 'red.400';
    return 'red.600';
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md" maxW="400px" mx="auto">
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Votre Score de Risque
        </Text>
        <Flex align="center" justify="center">
          <Text fontSize="2xl" fontWeight="bold" color={getColor(riskScore)}>
            {riskScore}
          </Text>
          <Text fontSize="lg" ml={2}>/ 10</Text>
        </Flex>
        <Progress colorScheme={getColor(riskScore).split('.')[0]} value={(riskScore / 10) * 100} size="lg" w="100%" />
      </VStack>
    </Box>
  );
};

export default CombinedRiskScoreComponent;
