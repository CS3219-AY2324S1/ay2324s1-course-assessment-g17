import { MenuButton, Tooltip, Menu, type MenuButtonProps } from '@chakra-ui/react';
import React from 'react';

interface MenuButtonWithTooltipProps {
  tooltipLabel: string;
  menuButtonProps?: MenuButtonProps;
  menuButtonContent: JSX.Element;
  menuList: JSX.Element;
}

const MenuButtonWithTooltip: React.FC<MenuButtonWithTooltipProps> = ({
  tooltipLabel,
  menuButtonProps,
  menuButtonContent,
  menuList,
}: MenuButtonWithTooltipProps) => {
  return (
    <Tooltip shouldWrapChildren label={tooltipLabel}>
      <Menu>
        <MenuButton {...menuButtonProps}>{menuButtonContent}</MenuButton>
        {menuList}
      </Menu>
    </Tooltip>
  );
};

export default MenuButtonWithTooltip;
