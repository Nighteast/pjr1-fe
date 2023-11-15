import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams();
  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogout() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex gap={"10px"} m={"10px"}>
      <Button colorScheme="facebook" onClick={() => navigate("/")}>
        home
      </Button>
      {isAuthenticated() && (
        <Button colorScheme="facebook" onClick={() => navigate("/write")}>
          write
        </Button>
      )}
      {isAuthenticated() || (
        <Button colorScheme="facebook" onClick={() => navigate("/signup")}>
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button colorScheme="facebook" onClick={() => navigate("/member/list")}>
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          colorScheme="facebook"
          onClick={() => navigate("/member?" + urlParams.toString())}
        >
          회원정보
        </Button>
      )}
      {isAuthenticated() || (
        <Button colorScheme="facebook" onClick={() => navigate("/login")}>
          로그인
        </Button>
      )}
      {isAuthenticated() && (
        <Button colorScheme="facebook" onClick={handleLogout}>
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
