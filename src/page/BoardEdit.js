import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect } from "react";
import axios from "axios";

export function BoardEdit() {
  // useImmer 사용, 상태를 생성
  const [board, updateBoard] = useImmer(null);

  // /edit/:id 이므로 useParams로 URL에서 게시글 ID가져오기
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  // 게시글을 로딩중이라면 스피너 돌리기
  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.title = e.target.value;
            });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.content = e.target.value;
            });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.writer = e.target.value;
            });
          }}
        />
      </FormControl>
    </Box>
  );
}
