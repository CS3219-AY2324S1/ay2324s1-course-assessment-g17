import { Tag } from '@chakra-ui/react';
import { QuestionComplexityEnum } from '../../types/questions/questions';
import React from 'react';

interface QuestionComplexityTagProps {
  questionComplexity: QuestionComplexityEnum;
}

const QuestionComplexityTag: React.FC<QuestionComplexityTagProps> = ({
  questionComplexity,
}: QuestionComplexityTagProps) => {
  switch (questionComplexity) {
    case QuestionComplexityEnum.EASY:
      return <Tag colorScheme="green">{questionComplexity}</Tag>;
    case QuestionComplexityEnum.MEDIUM:
      return <Tag colorScheme="orange">{questionComplexity}</Tag>;
    case QuestionComplexityEnum.HARD:
      return <Tag colorScheme="red">{questionComplexity}</Tag>;
    default:
    // should not happen
  }
};

export default QuestionComplexityTag;
