import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';

interface PasswordFieldProps {
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  placeholder = 'Enter password',
  onChange,
}: PasswordFieldProps) => {
  const [isVisible, setVisibility] = useState(false);
  return (
    <InputGroup size="md">
      <Input type={isVisible ? 'text' : 'password'} placeholder={placeholder} onChange={onChange} />
      <InputRightElement width="4.5rem">
        <IconButton
          aria-label={isVisible ? 'Hide password' : 'Show Password'}
          size="sm"
          variant="ghost"
          icon={isVisible ? <BiShow size={20} /> : <BiHide size={20} />}
          onClick={() => {
            setVisibility(!isVisible);
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordField;
