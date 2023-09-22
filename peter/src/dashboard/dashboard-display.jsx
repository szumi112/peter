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

// import loadsData from "./data";
import "./table.css";

import { db } from "../firebase-config/firebase-config";
import { collection, getDocs, updateDoc, doc } from "@firebase/firestore";

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
  const isMobile = window.innerWidth <= 1100;

  const updateLoad = async (id, note) => {
    const loadDoc = doc(db, "loads", id);
    const newFields = {
      note: note,
    };
    await updateDoc(loadDoc, newFields);
    updateLoad();
  };

  useEffect(() => {
    updateLoad();
  }, [userMessage]);

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
          {loads.map((load, index) => (
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
                    {load.formData.ref_mp_po},
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
                    {load.formData.ref_ref}
                  </Text>
                </Flex>
              </Td>
              <Td>
                <Flex flexDir={"column"}>
                  <Text color="green.400">
                    {load.formData.status_description}
                  </Text>

                  <Flex>
                    {Array.from({ length: 4 }, (_, i) => (
                      <Box
                        key={i}
                        w="20px"
                        h="5px"
                        bg={
                          i < load.formData.status
                            ? getRandomColor()
                            : "gray.400"
                        }
                        borderRadius="20%"
                        mr="2px"
                      ></Box>
                    ))}
                  </Flex>
                </Flex>
              </Td>
              <Td>
                {isMobile && (
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    Collection:
                  </Text>
                )}
                <Text
                  color={colorMode === "dark" ? "gray.200" : "gray.700"}
                  mr={3}
                  fontWeight={"500"}
                >
                  {load.formData.collection_city}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.formData.collection_street},{" "}
                  {load.formData.collection_zip_cod}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.formData.collection_country}
                </Text>
              </Td>
              <Td>
                {isMobile && (
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    Delivery:
                  </Text>
                )}
                <Text
                  color={colorMode === "dark" ? "gray.200" : "gray.700"}
                  mr={3}
                  fontWeight={"500"}
                >
                  {load.formData.delivery_city}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.formData.delivery_street},{" "}
                  {load.formData.delivery_zip_code}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load.formData.delivery_country}
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
                    {load.formData.collection_date},{" "}
                    {load.formData.collection_time}
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
                    {load.formData.delivery_date}, {load.formData.delivery_time}
                  </Text>
                </Flex>
              </Td>
              <Td>
                {isMobile && (
                  <Text
                    color={colorMode === "dark" ? "gray.200" : "gray.700"}
                    mr={3}
                    fontWeight={"500"}
                  >
                    Vehicle Pallet:
                  </Text>
                )}
                {load.formData.vehicle_pallet.toUpperCase()}
              </Td>
              <Td>
                <Flex>
                  {isMobile && (
                    <Text
                      color={colorMode === "dark" ? "gray.200" : "gray.700"}
                      mr={3}
                      fontWeight={"500"}
                    >
                      Rate:
                    </Text>
                  )}
                  {load.formData.rate_currency} {load.formData.rate}
                </Flex>
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={openModal(load.id)}
                >
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
                      <Flex>
                        <Button colorScheme="blue" onClick={closeModal} mr={2}>
                          Close
                        </Button>
                        <Button
                          colorScheme="green"
                          onClick={(e) => {
                            closeModal();
                            updateLoad(load.id, userMessage);
                          }}
                        >
                          {/* {load.id} */}
                          Save
                        </Button>
                      </Flex>
                    </ModalFooter>
                    <Flex px={6} pb={6}>
                      {load.note}
                    </Flex>
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
