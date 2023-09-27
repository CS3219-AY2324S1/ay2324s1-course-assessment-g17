import { IconButton, Tooltip, type IconButtonProps } from '@chakra-ui/react';
import React from 'react';

interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltipLabel: string;
}

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = ({
  tooltipLabel,
  ...iconButtonProps
}: IconButtonWithTooltipProps) => {
  return (
    <Tooltip label={tooltipLabel}>
      <IconButton {...iconButtonProps} />
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
