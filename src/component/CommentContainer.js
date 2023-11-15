import { Box, Button, Heading, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Heading>댓글</Heading>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardId);

    axios
      .get("/api/comment/list?" + params.toString())
      .then((response) => setCommentList(response.data));
  }, []);

  return <Box>댓글 리스트</Box>;
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
