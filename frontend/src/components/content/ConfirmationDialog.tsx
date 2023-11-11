import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  type ButtonProps,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import React from 'react';

interface ConfirmationDialogProps {
  dialogHeader: string;
  dialogBody: string;
  mainButtonLabel: string;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  mainButtonProps?: ButtonProps;
  leftButtonProps?: ButtonProps;
  rightButtonProps?: ButtonProps;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogHeader,
  dialogBody,
  mainButtonLabel,
  leftButtonLabel = 'Cancel',
  rightButtonLabel = 'Confirm',
  mainButtonProps,
  leftButtonProps,
  rightButtonProps,
  onConfirm,
}: ConfirmationDialogProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button mt={2} size={'sm'} onClick={onOpen} {...mainButtonProps}>
        {mainButtonLabel}
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent minW={{ lg: '700px' }} padding={2}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogHeader}
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>{dialogBody}</AlertDialogBody>
            <AlertDialogFooter mt={2}>
              <Button ref={cancelRef} onClick={onClose} {...leftButtonProps}>
                {leftButtonLabel}
              </Button>
              <Button onClick={onConfirm} ml={3} colorScheme="blue" {...rightButtonProps}>
                {rightButtonLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmationDialog;
