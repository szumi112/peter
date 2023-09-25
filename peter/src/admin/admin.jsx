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

const Admin = () => {
  const { colorMode } = useColorMode();
  const loadCollectionRef = collection(db, "loads");
  const navigate = useNavigate();
  const [loads, setLoads] = useState([]);
  const [data, setData] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchMPPo, setSearchMPPo] = useState("");
  const [searchReference, setSearchReference] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [sortBy, setSortBy] = useState("mostRecent");
  const [loadAdded, setLoadAdded] = useState(false);

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
    vehicle_pallet: "",
    rate: "",
    rate_currency: "",
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
      vehicle_pallet: "",
      rate: "",
      rate_currency: "",
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

      <Flex justifyContent={"space-between"} alignItems={"center"} mb={10}>
        <Button
          onClick={() => navigate("/dashboard")}
          variant={"link"}
          _hover={{ color: "blue.300" }}
        >
          {"\u{1F868}"} Back to dashboard
        </Button>
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
            <Flex justifyContent={"space-between"} mt={1}>
              <Input
                type="text"
                name="ref_mp_po"
                placeholder="MP PO"
                value={formData.ref_mp_po}
                onChange={handleChange}
                w="45%"
              />
              <Input
                type="text"
                name="ref_ref"
                placeholder="Reference"
                value={formData.ref_ref}
                onChange={handleChange}
                w="45%"
              />
            </Flex>
            <Flex justifyContent={"space-between"} my={1}>
              <Select
                name="status"
                placeholder="Delivery Step"
                value={formData.status.number}
                onChange={handleChange}
                w={"15%"}
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
                w="20%"
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
                w="45%"
              />
            </Flex>
            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="collection_street"
                placeholder="Collection Street"
                value={formData.collection_street}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="collection_zip_code"
                placeholder="Collection Zip Code"
                value={formData.collection_zip_code}
                onChange={handleChange}
                w="45%"
              />
            </Flex>
            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="collection_country"
                placeholder="Collection Country"
                value={formData.collection_country}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="delivery_city"
                placeholder="Delivery City"
                value={formData.delivery_city}
                onChange={handleChange}
                w="45%"
              />
            </Flex>

            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="delivery_street"
                placeholder="Delivery Street"
                value={formData.delivery_street}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="delivery_zip_code"
                placeholder="Delivery Zip Code"
                value={formData.delivery_zip_code}
                onChange={handleChange}
                w="45%"
              />
            </Flex>

            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="delivery_country"
                placeholder="Delivery Country"
                value={formData.delivery_country}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="collection_date"
                placeholder="Collection Date (YYYY-MM-DD)"
                value={formData.collection_date}
                onChange={handleChange}
                w="45%"
              />
            </Flex>

            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="delivery_date"
                placeholder="Delivery Date (YYYY-MM-DD)"
                value={formData.delivery_date}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="collection_time"
                placeholder="Collection Time"
                value={formData.collection_time}
                onChange={handleChange}
                w="45%"
              />
            </Flex>

            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="delivery_time"
                placeholder="Delivery Time"
                value={formData.delivery_time}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="vehicle_pallet"
                placeholder="Vehicle Pallet"
                value={formData.vehicle_pallet}
                onChange={handleChange}
                w="45%"
              />
            </Flex>

            <Flex justifyContent={"space-between"} my={1}>
              <Input
                type="text"
                name="rate"
                placeholder="Rate"
                value={formData.rate}
                onChange={handleChange}
                w="45%"
                mr={"10%"}
              />
              <Input
                type="text"
                name="rate_currency"
                placeholder="Currency ($, £, €) "
                value={formData.rate_currency}
                onChange={handleChange}
                w="45%"
              />
            </Flex>
          </Flex>
          <Box w="100%" textAlign={"right"}>
            <Button onClick={handleSubmit} my={6} ml="auto" w="20%">
              Add Load
            </Button>
          </Box>
        </form>
      )}

      <Box
        mb={4}
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
            placeholder="Search by MP_PO"
            onChange={(e) => setSearchMPPo(e.target.value)}
          />
        </FormControl>
        <FormControl my={{ base: 2, md: 0 }} mx={2}>
          <Input
            height={{ base: "40px", "2xl": "50px" }}
            type="text"
            placeholder="Search by Reference"
            onChange={(e) => setSearchReference(e.target.value)}
          />
        </FormControl>

        <Box mb={4} display="flex" justifyContent="space-between">
          <Button
            onClick={() => setSortBy("oldest")}
            height={{ base: "40px", "2xl": "50px" }}
            mx={2}
          >
            Most Recent
          </Button>
          <Button
            onClick={() => setSortBy("mostRecent")}
            height={{ base: "40px", "2xl": "50px" }}
          >
            Oldest
          </Button>
        </Box>
      </Box>
      <Text fontSize="32px">All loads:</Text>
      <Table mt={8} mb={12}>
        <Thead>
          <Tr>
            <Th className="table-responsive-sizes-text">Email</Th>
            <Th className="table-responsive-sizes-text">MP PO/Reference</Th>
            <Th className="table-responsive-sizes-text">Status</Th>
            <Th className="table-responsive-sizes-text">Collection</Th>
            <Th className="table-responsive-sizes-text">Delivery</Th>
            <Th className="table-responsive-sizes-text">Dates</Th>
            <Th className="table-responsive-sizes-text">Vehicle Pallet</Th>
            <Th className="table-responsive-sizes-text">Rate</Th>
            <Th className="table-responsive-sizes-text">Actions</Th>
          </Tr>
        </Thead>
        <Tbody className="table-responsive-sizes-text">
          {sortedLoads.map((load, index) => (
            <>
              <Tr key={index}>
                <Td>
                  {editingLoads[load.id] ? (
                    <Input
                      type="text"
                      name="email"
                      value={load?.formData?.email}
                      onChange={(e) => handleEditChange(e, load.id)}
                    />
                  ) : (
                    load?.formData?.email
                  )}
                </Td>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Input
                        type="text"
                        name="ref_mp_po"
                        placeholder="MP PO"
                        value={load?.formData?.ref_mp_po}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="ref_ref"
                        placeholder="Reference"
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
                        <span style={{ fontWeight: "500" }}>References:</span>{" "}
                        {load?.formData?.ref_ref}
                      </Text>
                    </>
                  )}
                </Td>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
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
                      <Text mb={3}>{load?.formData?.status}/4</Text>
                      <Text>{load?.formData?.status_description}</Text>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Input
                        type="text"
                        name="collection_city"
                        placeholder="Collection City"
                        value={load?.formData?.collection_city}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="collection_street"
                        placeholder="Collection Street"
                        value={load?.formData?.collection_street}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="collection_zip_code"
                        placeholder="Collection Zip Code"
                        value={load?.formData?.collection_zip_code}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
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
                      <Text mb={3}>
                        <span style={{ fontWeight: "500" }}>
                          {load?.formData?.collection_city}
                        </span>
                      </Text>
                      <Text my={4}>{load?.formData?.collection_street}</Text>
                      <Text>
                        {load?.formData?.collection_zip_code},{" "}
                        {load?.formData?.collection_country}
                      </Text>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Input
                        type="text"
                        name="delivery_city"
                        placeholder="Delivery City"
                        value={load?.formData?.delivery_city}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="delivery_street"
                        placeholder="Delivery Street"
                        value={load?.formData?.delivery_street}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="delivery_zip_code"
                        placeholder="Delivery Zip Code"
                        value={load?.formData?.delivery_zip_code}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
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
                      <Text mb={3}>
                        <span style={{ fontWeight: "500" }}>
                          {load?.formData?.delivery_city}
                        </span>
                      </Text>
                      <Text my={4}>{load?.formData?.delivery_street}</Text>
                      <Text>
                        {load?.formData?.delivery_zip_code},{" "}
                        {load?.formData?.delivery_country}
                      </Text>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Text mb={3}>
                        <span
                          style={{ fontWeight: "500", marginRight: "10px" }}
                        >
                          Collection:
                        </span>
                        {load?.formData?.collection_date},{" "}
                        {load?.formData?.collection_time}
                      </Text>
                      <Text mb={3}>
                        <span
                          style={{ fontWeight: "500", marginRight: "10px" }}
                        >
                          Delivery:
                        </span>
                        {load?.formData?.delivery_date},{" "}
                        {load?.formData?.delivery_time}
                      </Text>
                    </>
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <Input
                      type="text"
                      name="vehicle_pallet"
                      placeholder="Vehicle Pallet"
                      value={load?.formData?.vehicle_pallet}
                      onChange={(e) => handleEditChange(e, load.id)}
                    />
                  ) : (
                    load?.formData?.vehicle_pallet.toUpperCase()
                  )}
                </Td>
                <Td>
                  {editingLoads[load.id] ? (
                    <>
                      <Input
                        type="text"
                        name="rate_currency"
                        placeholder="Currency ($, £, €)"
                        value={load?.formData?.rate_currency}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                      <Input
                        type="text"
                        name="rate"
                        placeholder="Rate"
                        value={load?.formData?.rate}
                        onChange={(e) => handleEditChange(e, load.id)}
                      />
                    </>
                  ) : (
                    `${load?.formData?.rate_currency} ${load?.formData?.rate}`
                  )}
                </Td>

                <Td>
                  {editingLoads[load.id] ? (
                    <Button
                      size={{ base: "sm", "2xl": "lg" }}
                      colorScheme="teal"
                      onClick={() => saveEdits(load.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      size={{ base: "sm", "2xl": "lg" }}
                      colorScheme="teal"
                      mr={4}
                      onClick={() => toggleEdit(load.id)}
                    >
                      ✏ Edit
                    </Button>
                  )}
                  <Button
                    size={{ base: "sm", "2xl": "lg" }}
                    colorScheme="red"
                    bg={colorMode === "dark" ? "red.500" : "red.500"}
                    onClick={() => {
                      deleteLoad(load?.id);
                    }}
                  >
                    🗑️ Delete
                  </Button>
                  {load?.note && (
                    <Box mt={3}>
                      <Button
                        size={{ base: "sm", "2xl": "lg" }}
                        fontWeight={"500"}
                        onClick={() => setShowNotes(!showNotes)}
                      >
                        Show notes
                      </Button>
                      {showNotes && (
                        <Text>
                          {load.note
                            .split(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g)
                            .map((text, index) =>
                              /\d{1,2}\/\d{1,2}\/\d{4}/.test(text) ? (
                                <React.Fragment key={index}>
                                  <br />
                                  {text}
                                </React.Fragment>
                              ) : (
                                text
                              )
                            )}
                        </Text>
                      )}
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
