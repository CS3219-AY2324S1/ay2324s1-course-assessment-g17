import { Button, MenuDivider, MenuGroup, MenuItem, MenuItemOption, MenuList, MenuOptionGroup } from '@chakra-ui/react';
import { MdSettings, MdFileOpen, MdDownload } from 'react-icons/md';
import MenuButtonWithTooltip from '../content/MenuButtonWithTooltip';
import { EditorThemeOptions } from '../../types/code/themes';
import React from 'react';

interface CodeEditorSettingsProps {
  selectedTheme: string;
  toggleSelectedTheme: (theme: string) => void;
}

const CodeEditorSettings: React.FC<CodeEditorSettingsProps> = ({
  selectedTheme,
  toggleSelectedTheme,
}: CodeEditorSettingsProps) => {
  return (
    <MenuButtonWithTooltip
      tooltipLabel="Settings"
      menuButtonProps={{
        as: Button,
      }}
      menuButtonContent={<MdSettings />}
      menuList={
        <MenuList>
          <MenuOptionGroup
            title="Editor Theme"
            value={selectedTheme}
            type="radio"
            onChange={(theme) => {
              toggleSelectedTheme(theme as string);
            }}
          >
            {EditorThemeOptions.map((theme) => (
              <MenuItemOption value={theme.value} key={theme.value}>
                {theme.label}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
          <MenuDivider />
          <MenuGroup title="Actions">
            {/* Not implemented yet */}
            <MenuItem icon={<MdFileOpen size={18} />}>Open...</MenuItem>
            <MenuItem icon={<MdDownload size={18} />}>Download File</MenuItem>
          </MenuGroup>
        </MenuList>
      }
    />
  );
};

export default CodeEditorSettings;
