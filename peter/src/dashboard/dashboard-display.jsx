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
  FormControl,
  Input,
  Select,
} from "@chakra-ui/react";

import "./table.css";

import { db } from "../firebase-config/firebase-config";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "@firebase/firestore";

const statusColors = {
  1: "green.400",
  2: "cyan.400",
  3: "orange.500",
  4: "blue.400",
};

const DashboardDisplay = () => {
  const { colorMode } = useColorMode();
  const [openModalId, setOpenModalId] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [loads, setLoads] = useState([]);
  const [loadModals, setLoadModals] = useState({});
  const loadsCollectionRef = collection(db, "loads");
  const isMobile = window.innerWidth <= 1100;

  const [searchCity, setSearchCity] = useState("");
  const [searchMPPo, setSearchMPPo] = useState("");
  const [searchReference, setSearchReference] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [filteredLoads, setFilteredLoads] = useState([]);

  const [sortBy, setSortBy] = useState("mostRecent");
  useEffect(() => {
    handleSort(sortBy);
  }, [sortBy]);

  const handleSort = (sortMethod) => {
    const sortedLoads = [...filteredLoads];

    if (sortMethod === "oldest") {
      sortedLoads.sort((a, b) => {
        const dateA = new Date(a.formData.collection_date);
        const dateB = new Date(b.formData.collection_date);
        console.log("Sorting oldest:", dateA, dateB);
        return dateA - dateB;
      });
    } else if (sortMethod === "mostRecent") {
      sortedLoads.sort((a, b) => {
        const dateA = new Date(a.formData.collection_date);
        const dateB = new Date(b.formData.collection_date);
        console.log("Sorting mostRecent:", dateA, dateB);
        return dateB - dateA;
      });
    }

    setFilteredLoads(sortedLoads);
  };

  const updateLoadNotes = async (loadId, note) => {
    try {
      const loadDocRef = doc(db, "loads", loadId);
      const loadDocSnapshot = await getDoc(loadDocRef);

      if (loadDocSnapshot.exists()) {
        const loadData = loadDocSnapshot.data();
        const currentNotes = loadData.note || "";

        const currentDate = new Date();
        const formattedTimestamp = currentDate.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const newNote = `${formattedTimestamp}: ${note}`;
        const updatedNotes = `${currentNotes}\n${newNote}`;

        await updateDoc(loadDocRef, { note: updatedNotes });

        const updatedLoadDocSnapshot = await getDoc(loadDocRef);
        if (updatedLoadDocSnapshot.exists()) {
          const updatedLoadData = updatedLoadDocSnapshot.data();
          setLoads((prevLoads) =>
            prevLoads.map((load) =>
              load.id === loadId
                ? { ...load, note: updatedLoadData.note }
                : load
            )
          );
        }

        setUserMessage("");
      }
    } catch (error) {
      console.error("Error updating load notes:", error);
    }
  };

  useEffect(() => {
    if (userMessage) {
      const loadIdToUpdate = Object.keys(loadModals).find(
        (loadId) => loadModals[loadId]
      );
      if (loadIdToUpdate) {
        updateLoadNotes(loadIdToUpdate, userMessage);
      }
    }
  }, [userMessage, loadModals]);

  useEffect(() => {
    const getLoads = async () => {
      const data = await getDocs(loadsCollectionRef);
      const allLoads = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const filtered = allLoads.filter((load) => {
        const cityMatch = load?.formData?.collection_city
          ?.toLowerCase()
          .includes(searchCity.toLowerCase());
        const mpPoMatch = load?.formData?.ref_mp_po
          ?.toLowerCase()
          .includes(searchMPPo.toLowerCase());
        const referenceMatch = load?.formData?.ref_ref
          ?.toLowerCase()
          .includes(searchReference.toLowerCase());
        const statusMatch =
          searchStatus === "" ||
          String(load?.formData?.status) === searchStatus;

        return cityMatch && mpPoMatch && referenceMatch && statusMatch;
      });

      setFilteredLoads(filtered);
    };

    getLoads();
  }, [searchCity, searchMPPo, searchReference, searchStatus]);

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const openModalForLoad = (loadId) => {
    setOpenModalId(loadId);
  };

  const closeModalForLoad = () => {
    setOpenModalId(null);
    setUserMessage("");
  };

  return (
    <Box py={4}>
      <Box mb={4} display="flex" justifyContent="space-between">
        <FormControl>
          <Input
            type="text"
            placeholder="Search by City"
            onChange={(e) => setSearchCity(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Search by MP_PO"
            onChange={(e) => setSearchMPPo(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Search by Reference"
            onChange={(e) => setSearchReference(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Select
            placeholder="Search by Status"
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
        </FormControl>
        <Box mb={4} display="flex" justifyContent="space-between">
          <Button onClick={() => setSortBy("oldest")}>Most Recent</Button>
          <Button onClick={() => setSortBy("mostRecent")}>Oldest</Button>
        </Box>
      </Box>

      <Text mb={8} fontSize={"21px"} fontWeight={"500"}>
        Loads in Progress:
      </Text>

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
          {filteredLoads?.map((load, index) => (
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
                    {load?.formData?.ref_mp_po},
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
                    {load?.formData?.ref_ref}
                  </Text>
                </Flex>
              </Td>
              <Td>
                <Flex flexDir={"column"}>
                  <Text
                    color={
                      load?.formData?.status
                        ? statusColors[load?.formData?.status] || "gray.400"
                        : "gray.400"
                    }
                  >
                    {load?.formData?.status_description}
                  </Text>

                  <Flex>
                    {Array.from({ length: 4 }, (_, i) => (
                      <Box
                        key={i}
                        w="20px"
                        h="5px"
                        bg={
                          i + 1 <= load?.formData?.status
                            ? statusColors[load?.formData?.status] || "gray.400"
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
                  {load?.formData?.collection_city}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load?.formData?.collection_street},{" "}
                  {load?.formData?.collection_zip_code}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load?.formData?.collection_country}
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
                  {load?.formData?.delivery_city}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load?.formData?.delivery_street},{" "}
                  {load?.formData?.delivery_zip_code}
                </Text>
                <Text
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontWeight={"400"}
                >
                  {load?.formData?.delivery_country}
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
                    {load?.formData?.collection_date},{" "}
                    {load?.formData?.collection_time}
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
                    {load?.formData?.delivery_date},{" "}
                    {load?.formData?.delivery_time}
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
                {load?.formData?.vehicle_pallet.toUpperCase()}
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
                  {load?.formData?.rate_currency} {load?.formData?.rate}
                </Flex>
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => openModalForLoad(load.id)}
                >
                  Notes
                </Button>

                <Modal
                  isOpen={openModalId === load.id}
                  onClose={closeModalForLoad}
                >
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
                        <Button
                          colorScheme="blue"
                          onClick={() => closeModalForLoad(load.id)}
                          mr={2}
                        >
                          Close
                        </Button>
                        <Button
                          colorScheme="green"
                          onClick={() => {
                            // closeModalForLoad(load.id);
                            updateLoadNotes(load?.id, userMessage);
                          }}
                        >
                          Save
                        </Button>
                      </Flex>
                    </ModalFooter>
                    <Flex px={6} pb={6}>
                      <Text whiteSpace="pre-line">{load?.note}</Text>
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
