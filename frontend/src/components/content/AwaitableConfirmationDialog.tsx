import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface useAwaitableConfirmationDialogObject {
  Confirmation: () => JSX.Element;
  getConfirmation: (
    dialogHeader: string,
    dialogBody: string,
    confirmationLabel: string,
    cancelLabel: string,
  ) => Promise<boolean>;
}

const useAwaitableConfirmationDialog: () => useAwaitableConfirmationDialogObject = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dialogHeader, setDialogHeader] = useState('');
  const [dialogBody, setDialogBody] = useState('');
  const [confirmationLabel, setConfirmationLabel] = useState('');
  const [cancelLabel, setCancelLabel] = useState('');
  const [resolver, setResolver] = useState<{ resolve: (value: boolean | PromiseLike<boolean>) => void }>();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const getConfirmation = async (
    dialogHeader: string,
    dialogBody: string,
    confirmationLabel: string,
    cancelLabel: string,
  ): Promise<boolean> => {
    const confirmationPromise = new Promise<boolean>((resolve, _reject) => {
      setResolver({ resolve });
    });
    onOpen();
    setDialogHeader(dialogHeader);
    setDialogBody(dialogBody);
    setConfirmationLabel(confirmationLabel);
    setCancelLabel(cancelLabel);
    return await confirmationPromise;
  };

  const onConfirm = (status: boolean): void => {
    resolver?.resolve(status);
  };

  const Confirmation = (): JSX.Element => (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent minW={{ lg: '700px' }} padding={2}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {dialogHeader}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{dialogBody}</AlertDialogBody>
          <AlertDialogFooter mt={2}>
            <Button
              ref={cancelRef}
              onClick={() => {
                onConfirm(false);
                onClose();
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={() => {
                onConfirm(true);
                onClose();
              }}
              ml={3}
              colorScheme="blue"
            >
              {confirmationLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  return { Confirmation, getConfirmation };
};

export default useAwaitableConfirmationDialog;
