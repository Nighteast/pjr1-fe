import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

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
          {board.id}번 글 보기
        </Heading>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea value={board.content} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.writer} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>작성일시</FormLabel>
          <Input value={board.inserted} readOnly />
        </FormControl>
      </VStack>
    </Box>
  );
}
