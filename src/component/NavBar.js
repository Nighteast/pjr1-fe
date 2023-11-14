import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <Flex gap={"10px"} m={"10px"}>
      <Button colorScheme="facebook" onClick={() => navigate("/")}>
        home
      </Button>
      <Button colorScheme="facebook" onClick={() => navigate("/write")}>
        write
      </Button>
      <Button colorScheme="facebook" onClick={() => navigate("/signup")}>
        signup
      </Button>
      <Button colorScheme="facebook" onClick={() => navigate("/member/list")}>
        회원목록
      </Button>
      <Button colorScheme="facebook" onClick={() => navigate("/login")}>
        로그인
      </Button>
    </Flex>
  );
}
