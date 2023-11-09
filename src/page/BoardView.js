import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Divider, Heading, Spinner, Text, VStack } from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box p={6}>
      <VStack spacing={4} align="start">
        <Heading as="h1" size="xl">
          글보기
        </Heading>
        <Divider />
        <Text>번호 : {board.id}</Text>
        <Text>제목 : {board.title}</Text>
        <Text>본문 : {board.content}</Text>
        <Text>작성자 : {board.writer}</Text>
        <Text>작성일시 : {board.inserted}</Text>
      </VStack>
    </Box>
  );
}
