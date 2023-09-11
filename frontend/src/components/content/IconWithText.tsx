import { Stack, Text, type TextProps } from '@chakra-ui/react';
import React from 'react';

interface IconWithTextProps extends TextProps {
  icon: JSX.Element;
  text: string;
}

const IconWithText: React.FC<IconWithTextProps> = ({ icon, text, ...textProps }: IconWithTextProps) => {
  return (
    <Stack direction="row" alignItems="center" justifyItems="center" gap={4}>
      {icon}
      <Text {...textProps}>{text}</Text>
    </Stack>
  );
};

export default IconWithText;
