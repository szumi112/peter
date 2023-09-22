import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorMode,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  ModalFooter,
} from "@chakra-ui/react";

import loadsData from "./data";
import "./table.css";

import { db } from "../firebase-config/firebase-config";
import { collection, getDocs } from "@firebase/firestore";

const possibleStatusColors = [
  "green.400",
  "green.400",
  "green.400",
  "green.400",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * possibleStatusColors.length);
  return possibleStatusColors[randomIndex];
};

const DashboardDisplay = () => {
  const { colorMode } = useColorMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [loads, setLoads] = useState([]);
  const loadsCollectionRef = collection(db, "loads");

  useEffect(() => {
    const getLoads = async () => {
      const data = await getDocs(loadsCollectionRef);
      setLoads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(loads);
    };

    getLoads();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  return (
    <Box p={4}>
      <Table>
        <Thead>
          <Tr>
            <Th color={colorMode === "dark" ? "gray.100" : "gray.700"}>
              MP PO/Reference
            </Th>
            <Th>Status</Th>
            <Th>Collection</Th>
            <Th>Delivery</Th>
            <Th>Dates</Th>
            <Th>Vehicle Pallet</Th>
            <Th>Rate</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody fontSize={"12px"}>
          {loadsData.map((load, index) => (
            <Tr
              key={index}
              color={colorMode === "dark" ? "gray.200" : "gray.700"}
            >
              <Td>
                <Flex>
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    MP PO:
                  </Text>
                  <Text
                    color={colorMode === "dark" ? "gray.400" : "gray.500"}
                    fontWeight={"400"}
                  >
                    {load.ref.mp_po},
                  </Text>
                </Flex>
                <Flex>
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    Reference:
                  </Text>
                  <Text
                    color={colorMode === "dark" ? "gray.400" : "gray.500"}
                    fontWeight={"400"}
                  >
                    {load.ref.ref}
                  </Text>
                </Flex>
              </Td>
              <Td>
                <Flex>
                  {Array.from({ length: 4 }, (_, i) => (
                    <Box
                      key={i}
                      w="20px"
                      h="5px"
                      bg={i < load.status ? getRandomColor() : "gray.400"}
                      borderRadius="20%"
                      mr="2px"
                    ></Box>
                  ))}
                </Flex>
              </Td>
              <Td>
                <Text
                  color={colorMode === "dark" ? "gray.200" : "gray.700"}
                  mr={3}
                  fontWeight={"500"}
                >
                  {load.collection.city}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.collection.street}, {load.collection.zip_code}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.collection.country}
                </Text>
              </Td>
              <Td>
                <Text
                  color={colorMode === "dark" ? "gray.200" : "gray.700"}
                  mr={3}
                  fontWeight={"500"}
                >
                  {load.delivery.city}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.delivery.street}, {load.delivery.zip_code}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.delivery.country}
                </Text>
              </Td>
              <Td>
                <Flex>
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    Collection:
                  </Text>
                  <Text
                    color={colorMode === "dark" ? "gray.400" : "gray.500"}
                    fontWeight={"400"}
                  >
                    {load.dates.Collection}, {load.dates.CollectionTime}
                  </Text>
                </Flex>

                <Flex>
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    Delivery:
                  </Text>
                  <Text
                    color={colorMode === "dark" ? "gray.400" : "gray.500"}
                    fontWeight={"400"}
                  >
                    {load.dates.Delivery}, {load.dates.DeliveryTime}
                  </Text>
                </Flex>
              </Td>
              <Td>{load.vehicle_pallet}</Td>
              <Td>{load.rate}</Td>
              <Td>
                <Button colorScheme="blue" size="sm" onClick={openModal}>
                  Notes
                </Button>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Enter Notes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Textarea
                        placeholder="Enter your notes here..."
                        value={userMessage}
                        onChange={handleUserMessageChange}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" onClick={closeModal} mr={2}>
                        Close
                      </Button>
                      <Button colorScheme="green" onClick={closeModal}>
                        Save
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DashboardDisplay;
