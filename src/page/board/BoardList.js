import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);

  const navigate = useNavigate();

  // 초기 렌더링 시 게시물 리스트 가져오기
  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  // localdatetime을 원하는 형식으로 변환하는 함수
  const formatLocalDateTime = (datetime) => {
    return format(new Date(datetime), "yyyy-MM-dd HH:mm:ss");
  };

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* boardList 배열 내의 각 요소를 순회하면서 각 요소에 대한 UI를 생성 */}
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                  background: "cornsilk",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
                <Td>{formatLocalDateTime(board.inserted)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
