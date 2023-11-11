import React, { useEffect, useState } from 'react';
import { Box, Card, Center, Progress, Text } from '@chakra-ui/react';

interface CountdownProgressBarProps {
  duration: number;
  onComplete: () => void;
}

function CountdownProgressBar({ duration, onComplete }: CountdownProgressBarProps): JSX.Element {
  const [countdown, setCountdown] = useState<number>(duration);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      onComplete();
    }

    return () => {
      clearInterval(interval);
    };
  }, [countdown, duration, onComplete]);

  // Calculate percentage
  const progress: number = ((duration - countdown) / duration) * 100;

  return (
    <Box width={'100%'}>
      <Card width={'100%'}>
        <Progress hasStripe mt={4} value={progress} size="lg" colorScheme="teal" width={'100%'} />
      </Card>
      <Center>
        <Text as="b" mt={4} fontSize="lg">
          Finding a match: {countdown} seconds remaining
        </Text>
      </Center>
    </Box>
  );
}

export default CountdownProgressBar;
