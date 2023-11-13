import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberList() {
  const [list, setList] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((response) => setList(response.data))
      .catch(console.log("error"))
      .finally(console.log("끝"));
  }, []);

  if (list === null) {
    return <Spinner />;
  }

  // 회원 목록 row 클릭 함수
  function handleTableRowClick(id) {
    const params = new URLSearchParams();
    params.set("id", id);
    // /member?id=id
    navigate("/member?" + params.toString());
  }

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>password</Th>
            <Th>email</Th>
            <Th>가입일시</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (
            <Tr
              onClick={() => handleTableRowClick(member.id)}
              key={member.id}
              _hover={{
                cursor: "pointer",
                backgroundColor: "cornsilk",
              }}
            >
              <Td>{member.id}</Td>
              <Td>{member.password}</Td>
              <Td>{member.email}</Td>
              <Td>{member.inserted}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
