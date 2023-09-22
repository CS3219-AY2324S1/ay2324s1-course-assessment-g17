import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@chakra-ui/react';

interface EditProfileProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onCloseModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input type="text" placeholder="Username" />
          <Input type="text" placeholder="Email" />
          <Input type="text" placeholder="Role" />
          <Input type="text" placeholder="Languages" />
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" colorScheme="green" mr={4}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
