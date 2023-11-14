import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Stack spacing={5} m={"10px"}>
      <Heading>로그인</Heading>
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>암호</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        로그인
      </Button>
    </Stack>
  );
}
