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
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config/firebase-config";

const Admin = () => {
  const loadCollectionRef = collection(db, "loads");
  const michal = "jestem Michal i lubie";
  const navigate = useNavigate();
  const [loads, setLoads] = useState([]);
  const [data, setData] = useState([]);
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

  const handleSubmit = async () => {
    await addDoc(loadCollectionRef, { formData });
    const newData = {
      ref: {
        mp_po: formData.ref_mp_po,
        ref: formData.ref_ref,
      },
      status: {
        number: formData.status,
        description: formData.status_description,
      },
      collection: {
        city: formData.collection_city,
        street: formData.collection_street,
        zip_code: formData.collection_zip_code,
        country: formData.collection_country,
      },
      delivery: {
        city: formData.delivery_city,
        street: formData.delivery_street,
        zip_code: formData.delivery_zip_code,
        country: formData.delivery_country,
      },
      dates: {
        Collection: formData.collection_date,
        Delivery: formData.delivery_date,
        CollectionTime: formData.collection_time,
        DeliveryTime: formData.delivery_time,
      },
      vehicle_pallet: formData.vehicle_pallet,
      rate: formData.rate,
      rate_currency: formData.rate_currency,
      email: formData.email,
    };

    setData([...data, newData]);

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
  }, []);

  console.log(loads);

  return (
    <Box p={4}>
      <Button
        onClick={() => navigate("/dashboard")}
        variant={"link"}
        _hover={{ color: "blue.300" }}
      >
        {"\u{1F868}"} Back to dashboard
      </Button>
      <Text fontSize="32px" my={4}>
        Admin Panel
      </Text>
      <form>
        <Flex w="100%" flexDir={"column"}>
          <Input
            type="text"
            name="email"
            placeholder="For who is this load for? Provide a valid e-mail address"
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
              <option value="Delivered">Delivered</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
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
            Add Data
          </Button>
        </Box>
      </form>
      <Text fontSize="32px">All loads data:</Text>
      <Table mt={4} mb={12}>
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>MP PO/Reference</Th>
            <Th>Status</Th>
            <Th>Collection</Th>
            <Th>Delivery</Th>
            <Th>Dates</Th>
            <Th>Vehicle Pallet</Th>
            <Th>Rate</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody fontSize={"12px"}>
          {loads.map((load, index) => (
            <>
              <Tr key={index}>
                <Td>{load.formData.email}</Td>
                <Td>
                  MP PO: {load.formData.ref_mp_po} <br />
                  References: {load.formData.ref_ref}
                </Td>
                <Td>
                  {load.formData.status} <br />{" "}
                  {load.formData.status_description}
                </Td>
                <Td>
                  {load.formData.collection_city}, <br />
                  {load.formData.collection_street},
                  {load.formData.collection_zip_code}, <br />
                  {load.formData.collection_country}
                </Td>
                <Td>
                  {load.formData.delivery_city}, <br />
                  {load.formData.delivery_street},
                  {load.formData.delivery_zip_code}, <br />
                  {load.formData.delivery_country}
                </Td>
                <Td>
                  {load.formData.collection_date},{" "}
                  {load.formData.collection_time}
                  , <br />
                  {load.formData.delivery_date}, {load.formData.delivery_time}
                </Td>
                <Td>{load.formData.vehicle_pallet}</Td>
                <Td>
                  {load.formData.rate_currency} {load.formData.rate}
                </Td>
                <Td>
                  <Flex justifyContent="flex-end">
                    <Button mr={1} size="sm">
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red">
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
              {data?.notes && (
                <Flex mt={3}>
                  <Text>Notes:</Text>
                  <Text>{data?.notes}</Text>
                </Flex>
              )}
            </>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Admin;
