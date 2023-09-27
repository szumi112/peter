import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Text,
  Flex,
  Select,
  FormControl,
  useColorMode,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config/firebase-config";
import Navigation from "../dashboard/navigation";
import DeleteConfirmationModal from "./delete-modal";
import NotesModal from "./notes-modal";

const Admin = () => {
  const { colorMode } = useColorMode();
  const loadCollectionRef = collection(db, "loads");
  const isMobile = window.innerWidth <= 1100;
  const navigate = useNavigate();
  const [loads, setLoads] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchMPPo, setSearchMPPo] = useState("");
  const [searchReference, setSearchReference] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [sortBy, setSortBy] = useState("mostRecent");
  const [loadAdded, setLoadAdded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadToDelete, setLoadToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const openDeleteModal = (loadId) => {
    setLoadToDelete(loadId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLoadToDelete(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const [formData, setFormData] = useState({
    email: "",
    ref_mp_po: "",
    ref_ref: "",
    status: "",
    status_description: "",
    collection_city: "",
    collection_street: "",
    collection_zip_code: "",
    collection_country: "",
    delivery_city: "",
    delivery_street: "",
    delivery_zip_code: "",
    delivery_country: "",
    collection_date: "",
    delivery_date: "",
    collection_time: "",
    delivery_time: "",
    vehicle_type: "",
    rate: "",
    rate_currency: "",
    eta: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [editingLoads, setEditingLoads] = useState({});
  const toggleEdit = (loadId) => {
    setEditingLoads((prevState) => ({
      ...prevState,
      [loadId]: !prevState[loadId],
    }));
  };

  const handleEditChange = (e, loadId) => {
    const { name, value } = e.target;
    setLoads((prevLoads) => {
      return prevLoads.map((load) => {
        if (load.id === loadId) {
          return {
            ...load,
            formData: {
              ...load.formData,
              [name]: value,
            },
          };
        }
        return load;
      });
    });
  };

  const saveEdits = async (loadId) => {
    const load = loads.find((load) => load.id === loadId);

    const loadDoc = doc(db, "loads", loadId);
    await updateDoc(loadDoc, {
      formData: load.formData,
    });

    toggleEdit(loadId);
  };

  const handleSubmit = async () => {
    await addDoc(loadCollectionRef, { formData });

    setLoadAdded((add) => !add);

    setFormData({
      email: "",
      ref_mp_po: "",
      ref_ref: "",
      status: "",
      status_description: "",
      collection_city: "",
      collection_street: "",
      collection_zip_code: "",
      collection_country: "",
      delivery_city: "",
      delivery_street: "",
      delivery_zip_code: "",
      delivery_country: "",
      collection_date: "",
      delivery_date: "",
      collection_time: "",
      delivery_time: "",
      vehicle_type: "",
      rate: "",
      rate_currency: "",
      eta: "",
    });
  };

  useEffect(() => {
    const getLoads = async () => {
      const data = await getDocs(loadCollectionRef);
      setLoads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getLoads();
  }, [loadAdded]);

  const filterLoads = () => {
    let filteredLoads = [...loads];

    if (searchCity) {
      filteredLoads = filteredLoads.filter(
        (load) =>
          load?.formData?.collection_city &&
          load?.formData?.collection_city
            .toLowerCase()
            .includes(searchCity.toLowerCase())
      );
    }

    if (searchMPPo) {
      filteredLoads = filteredLoads.filter(
        (load) =>
          load?.formData?.ref_mp_po &&
          load?.formData?.ref_mp_po
            .toLowerCase()
            .includes(searchMPPo.toLowerCase())
      );
    }

    if (searchReference) {
      filteredLoads = filteredLoads.filter(
        (load) =>
          load?.formData?.ref_ref &&
          load?.formData?.ref_ref
            .toLowerCase()
            .includes(searchReference.toLowerCase())
      );
    }

    if (searchStatus) {
      filteredLoads = filteredLoads.filter(
        (load) =>
          load?.formData?.status &&
          load?.formData?.status.toString() === searchStatus
      );
    }

    return filteredLoads;
  };

  const sortedLoads = filterLoads();

  const sortLoadsByOldest = (loadsToSort) => {
    return loadsToSort.sort((a, b) => {
      const dateA = new Date(a?.formData?.collection_date);
      const dateB = new Date(b?.formData?.collection_date);
      return dateA - dateB;
    });
  };

  const sortLoadsByMostRecent = (loadsToSort) => {
    return loadsToSort.sort((a, b) => {
      const dateA = new Date(a?.formData?.collection_date);
      const dateB = new Date(b?.formData?.collection_date);
      return dateB - dateA;
    });
  };

  if (sortBy === "oldest") {
    sortLoadsByOldest(sortedLoads);
  } else if (sortBy === "mostRecent") {
    sortLoadsByMostRecent(sortedLoads);
  }

  const deleteLoad = async (id) => {
    const loadDoc = doc(db, "loads", id);
    await deleteDoc(loadDoc);

    setLoads((prevLoads) => prevLoads.filter((load) => load.id !== id));
  };

  return (
    <Box p={4}>
      <Navigation />

      <Flex
        justifyContent={"space-between"}
        alignItems={"left"}
        mb={5}
        flexDir={{ base: "column", md: "row" }}
      >
        {/* <Button
          onClick={() => navigate("/dashboard")}
          variant={"link"}
          _hover={{ color: "blue.300" }}
          mb={{ base: 8, md: 0 }}
        >
          ⬅️ Back to dashboard
        </Button> */}
        <Button onClick={toggleForm} colorScheme={"blue"}>
          {showForm ? "➖ Hide Form" : "➕ Add a new load"}
        </Button>
      </Flex>

      {showForm && (
        <form>
          <Flex w="100%" flexDir={"column"}>
            <Input
              type="text"
              name="email"
              placeholder="Customer's contact email"
              value={formData.email}
              onChange={handleChange}
              w="100%"
              mb={2}
            />
            <Flex
              justifyContent={"space-between"}
              mt={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="ref_mp_po"
                placeholder="MP PO"
                value={formData.ref_mp_po}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
              <Input
                type="text"
                name="ref_ref"
                placeholder="Col. Reference"
                value={formData.ref_ref}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>
            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Select
                name="status"
                placeholder="Delivery Step"
                value={formData.status.number}
                onChange={handleChange}
                w={{ base: "100%", md: "15%" }}
                mr={0}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
              <Select
                name="status_description"
                placeholder="Delivery Status"
                value={formData.status_description}
                onChange={handleChange}
                w={{ base: "100%", md: "20%" }}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Booking">Booking</option>
                <option value="Collected">Collected</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Finished</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Load Cancelled">Load Cancelled</option>
                <option value="Load Cancelled">Something Went Wrong</option>
              </Select>
              <Input
                type="text"
                name="collection_city"
                placeholder="Collection City"
                value={formData.collection_city}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mt={{ base: 2, md: 0 }}
              />
            </Flex>
            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="collection_street"
                placeholder="Collection Street"
                value={formData.collection_street}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="collection_zip_code"
                placeholder="Collection Zip Code"
                value={formData.collection_zip_code}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>
            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="collection_country"
                placeholder="Collection Country"
                value={formData.collection_country}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="delivery_city"
                placeholder="Delivery City"
                value={formData.delivery_city}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>

            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="delivery_street"
                placeholder="Delivery Street"
                value={formData.delivery_street}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="delivery_zip_code"
                placeholder="Delivery Zip Code"
                value={formData.delivery_zip_code}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>

            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="delivery_country"
                placeholder="Delivery Country"
                value={formData.delivery_country}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="collection_date"
                placeholder="Collection Date (YYYY-MM-DD)"
                value={formData.collection_date}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>

            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="delivery_date"
                placeholder="Delivery Date (YYYY-MM-DD)"
                value={formData.delivery_date}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="collection_time"
                placeholder="Collection Time"
                value={formData.collection_time}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>

            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="delivery_time"
                placeholder="Delivery Time"
                value={formData.delivery_time}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="vehicle_type"
                placeholder="Vegetable & Amount"
                value={formData.vehicle_type}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>

            <Flex
              justifyContent={"space-between"}
              my={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Input
                type="text"
                name="rate"
                placeholder="Rate"
                value={formData.rate}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
                mr={{ base: 0, md: "10%" }}
              />
              <Input
                type="text"
                name="rate_currency"
                placeholder="Currency ($, £, €) "
                value={formData.rate_currency}
                onChange={handleChange}
                w={{ base: "100%", md: "45%" }}
              />
            </Flex>
            <Input
              type="text"
              name="eta"
              placeholder="ETA"
              value={formData.eta}
              onChange={handleChange}
              w={{ base: "100%", md: "45%" }}
              mt={1}
            />
          </Flex>
          <Box w="100%" textAlign={"right"}>
            <Button
              onClick={handleSubmit}
              my={6}
              px={4}
              ml="auto"
              w={{ base: "100%", md: "20%" }}
              colorScheme="green"
            >
              Add Load
            </Button>
          </Box>
        </form>
      )}
      <Button
        onClick={() => setShowFilters(!showFilters)}
        mb={8}
        w={{ base: "100%", md: "inherit" }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      {showFilters && (
        <Box
          mb={10}
          display="flex"
          flexDir={{ base: "column", md: "row" }}
          justifyContent="space-between"
        >
          <FormControl mx={2}>
            <Select
              height={{ base: "40px", "2xl": "50px" }}
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
          <FormControl my={{ base: 2, md: 0 }} mx={2}>
            <Input
              height={{ base: "40px", "2xl": "50px" }}
              type="text"
              placeholder="Search by City"
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </FormControl>
          <FormControl mx={2}>
            <Input
              height={{ base: "40px", "2xl": "50px" }}
              type="text"
              placeholder="Search by MP PO"
              onChange={(e) => setSearchMPPo(e.target.value)}
            />
          </FormControl>
          <FormControl my={{ base: 2, md: 0 }} mx={2}>
            <Input
              height={{ base: "40px", "2xl": "50px" }}
              type="text"
              placeholder="Search by Col. Reference"
              onChange={(e) => setSearchReference(e.target.value)}
            />
          </FormControl>

          <Box mb={4} display="flex" justifyContent="space-between">
            <Button
              onClick={() => setSortBy("oldest")}
              height={{ base: "40px", "2xl": "50px" }}
              mx={2}
            >
              Upcoming
            </Button>
            <Button
              onClick={() => setSortBy("mostRecent")}
              height={{ base: "40px", "2xl": "50px" }}
            >
              Future Dated
            </Button>
          </Box>
        </Box>
      )}
      <Text fontSize="32px">All loads:</Text>
      <Table mt={8} mb={12}>
        <Thead>
          <Tr>
            <Th className="table-responsive-sizes-text">Email</Th>
            <Th className="table-responsive-sizes-text">
              MP PO/Col. Reference
            </Th>
            <Th className="table-responsive-sizes-text">Status</Th>
            <Th className="table-responsive-sizes-text">Collection</Th>
            <Th className="table-responsive-sizes-text">Delivery</Th>
            <Th className="table-responsive-sizes-text">ETA</Th>
            <Th className="table-responsive-sizes-text">Vegetable & Amount</Th>
            <Th className="table-responsive-sizes-text">Rate</Th>
            <Th
              className="table-responsive-sizes-text"
              textAlign={"center"}
              w={{ base: "100%", md: "50px" }}
            >
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody className="table-responsive-sizes-text">
          {sortedLoads.map((load, index) => (
            <>
              <Tr key={index}>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        mb={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Email:
                      </Text>
                      <Input
                        type="text"
                        name="email"
                        value={load?.formData?.email}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    load?.formData?.email
                  )}
                </Td>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        mb={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        MP PO:
                      </Text>
                      <Input
                        type="text"
                        name="ref_mp_po"
                        placeholder="MP PO"
                        value={load?.formData?.ref_mp_po}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Col. Reference:
                      </Text>
                      <Input
                        type="text"
                        name="ref_ref"
                        placeholder="Col. Reference"
                        value={load?.formData?.ref_ref}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    <>
                      <Text mb={3}>
                        <span style={{ fontWeight: "500" }}>MP PO:</span>{" "}
                        {load?.formData?.ref_mp_po}{" "}
                      </Text>
                      <Text>
                        <span style={{ fontWeight: "500" }}>
                          Col. Reference:
                        </span>{" "}
                        {load?.formData?.ref_ref}
                      </Text>
                    </>
                  )}
                </Td>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        mb={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Status:
                      </Text>
                      <Select
                        name="status"
                        placeholder="Delivery Step"
                        value={load?.formData?.status}
                        onChange={(e) => handleEditChange(e, load.id)}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </Select>

                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Delivery Status:
                      </Text>
                      <Select
                        name="status_description"
                        placeholder="Delivery Status"
                        value={load?.formData?.status_description}
                        onChange={(e) => handleEditChange(e, load.id)}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Booking">Booking</option>
                        <option value="Collected">Collected</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Finished</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Load Cancelled">Load Cancelled</option>
                        <option value="Load Cancelled">
                          Something Went Wrong
                        </option>
                      </Select>
                    </>
                  ) : (
                    <>
                      <Text>
                        {load?.formData?.status}/4{" "}
                        {load?.formData?.status_description}
                      </Text>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        mb={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Collection City:
                      </Text>
                      <Input
                        type="text"
                        name="collection_city"
                        placeholder="Collection City"
                        value={load?.formData?.collection_city}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Collection Street:
                      </Text>
                      <Input
                        type="text"
                        name="collection_street"
                        placeholder="Collection Street"
                        value={load?.formData?.collection_street}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Collection Zip Code:
                      </Text>
                      <Input
                        type="text"
                        name="collection_zip_code"
                        placeholder="Collection Zip Code"
                        value={load?.formData?.collection_zip_code}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Collection Country:
                      </Text>
                      <Input
                        type="text"
                        name="collection_country"
                        placeholder="Collection Country"
                        value={load?.formData?.collection_country}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    <>
                      {isMobile && (
                        <Text
                          color={colorMode === "dark" ? "gray.200" : "gray.700"}
                          mr={3}
                          mb={4}
                          fontWeight={"500"}
                        >
                          Collection:
                        </Text>
                      )}
                      <Text mb={3} mt={2} fontWeight={"500"}>
                        {load?.formData?.collection_city}
                      </Text>

                      <Text my={4}>
                        {load?.formData?.collection_street},{" "}
                        {load?.formData?.collection_zip_code}
                      </Text>
                      <Flex mb={4}>
                        <Text mr={2}>
                          {load?.formData?.collection_country},
                        </Text>
                        <Text color="white" fontWeight={"500"}>
                          {load?.formData?.collection_date},
                          {load?.formData?.collection_time}
                        </Text>
                      </Flex>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        mb={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Delivery City:
                      </Text>
                      <Input
                        type="text"
                        name="delivery_city"
                        placeholder="Delivery City"
                        value={load?.formData?.delivery_city}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Delivery Street:
                      </Text>
                      <Input
                        type="text"
                        name="delivery_street"
                        placeholder="Delivery Street"
                        value={load?.formData?.delivery_street}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Delivery Zip Code:
                      </Text>
                      <Input
                        type="text"
                        name="delivery_zip_code"
                        placeholder="Delivery Zip Code"
                        value={load?.formData?.delivery_zip_code}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Delivery Country:
                      </Text>
                      <Input
                        type="text"
                        name="delivery_country"
                        placeholder="Delivery Country"
                        value={load?.formData?.delivery_country}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    <>
                      {isMobile && (
                        <Text
                          color={colorMode === "dark" ? "gray.200" : "gray.700"}
                          mr={3}
                          mb={4}
                          fontWeight={"500"}
                        >
                          Delivery:
                        </Text>
                      )}
                      <Text mb={3} fontWeight={"500"}>
                        {load?.formData?.delivery_city}
                      </Text>
                      <Text my={4}>
                        {load?.formData?.delivery_street},{" "}
                        {load?.formData?.delivery_zip_code}
                      </Text>
                      <Flex my={4}>
                        <Text>{load?.formData?.delivery_country},</Text>
                        <Text fontWeight={"600"} ml={2}>
                          {load?.formData?.collection_date},
                          {load?.formData?.collection_time}
                        </Text>
                      </Flex>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Collection Date & Time:
                      </Text>
                      <Input
                        type="text"
                        name="collection_date"
                        placeholder="Collection Date (YYYY-MM-DD)"
                        value={load?.formData?.collection_date}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="collection_time"
                        placeholder="Collection Time"
                        value={load?.formData?.collection_time}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Delivery Date & Time:
                      </Text>
                      <Input
                        type="text"
                        name="delivery_date"
                        placeholder="Delivery Date (YYYY-MM-DD)"
                        value={load?.formData?.delivery_date}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="delivery_time"
                        placeholder="Delivery Time"
                        value={load?.formData?.delivery_time}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        ETA:
                      </Text>
                      <Input
                        type="text"
                        name="eta"
                        placeholder="ETA"
                        value={load?.formData?.eta}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    <>
                      <Text>
                        <span
                          style={{ fontWeight: "500", marginRight: "10px" }}
                        >
                          ETA:
                        </span>
                        {load?.formData?.eta}
                      </Text>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Vegetable & Amount:
                      </Text>
                      <Input
                        type="text"
                        name="vehicle_type"
                        placeholder="Vegetable & Amount"
                        value={load?.formData?.vehicle_type}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    load?.formData?.vehicle_type?.toUpperCase()
                  )}
                </Td>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Currency:
                      </Text>
                      <Input
                        type="text"
                        name="rate_currency"
                        placeholder="Currency ($, £, €)"
                        value={load?.formData?.rate_currency}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Text
                        ml={2}
                        my={4}
                        className={editingLoads[load.id] ? "editTableName" : ""}
                      >
                        Rate:
                      </Text>
                      <Input
                        type="text"
                        name="rate"
                        placeholder="Rate"
                        value={load?.formData?.rate}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    <Flex alignItems={"center"}>
                      {load?.formData?.rate_currency}
                      {load?.formData?.rate}
                    </Flex>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <Button
                      size={{ base: "md", "2xl": "lg" }}
                      onClick={() => saveEdits(load.id)}
                      w={"100%"}
                      variant="ghost"
                    >
                      ✔️ Save
                    </Button>
                  ) : (
                    <Button
                      my={2}
                      size={{ base: "md", "2xl": "lg" }}
                      mr={4}
                      w={"100%"}
                      onClick={() => toggleEdit(load.id)}
                      variant="ghost"
                      textAlign={"center"}
                    >
                      ✏ Edit
                    </Button>
                  )}
                  <Button
                    my={2}
                    size={{ base: "md", "2xl": "lg" }}
                    w={"100%"}
                    onClick={() => {
                      openDeleteModal(load?.id);
                    }}
                    variant="ghost"
                  >
                    🗑️ Delete
                  </Button>
                  <DeleteConfirmationModal
                    isOpen={loadToDelete !== null}
                    onClose={closeDeleteModal}
                    onDelete={() => {
                      if (loadToDelete) {
                        deleteLoad(loadToDelete);
                      }
                      closeDeleteModal();
                    }}
                  />

                  {load?.note && (
                    <Box mt={1}>
                      <Button
                        size={{ base: "md", "2xl": "lg" }}
                        fontWeight={"500"}
                        onClick={() => setShowNotes(!showNotes)}
                        w={"100%"}
                        variant="ghost"
                      >
                        {!showNotes ? "Show notes" : "Hide Notes"}
                      </Button>
                      <NotesModal
                        isOpen={showNotes}
                        onClose={toggleNotes}
                        notes={load.note}
                      />
                      {/* {showNotes && (
                        <Text mb={6}>
                          {load.note
                            .split(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g)
                            .map((text, index) =>
                              /\d{1,2}\/\d{1,2}\/\d{4}/.test(text) ? (
                                <React.Fragment key={index}>
                                  <br />
                                  <br />
                                  {text}
                                </React.Fragment>
                              ) : (
                                text
                              )
                            )}
                        </Text>
                      )} */}
                    </Box>
                  )}
                </Td>
              </Tr>
            </>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Admin;
