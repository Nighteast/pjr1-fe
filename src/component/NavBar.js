import { Box, Button, Flex, Spacer, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleXmark,
  faHouse,
  faPen,
  faRightToBracket,
  faUser,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();

  const navigate = useNavigate();

  const urlParams = new URLSearchParams();

  // 현재 애플리케이션의 경로(location) 정보를 가져옴.
  // 경로에 따라 사이드 이펙트 수행시 좋음.
  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogout() {
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex gap={"10px"} mb={10}>
      <Button
        borderRadius={"0"}
        variant={"ghost"}
        size={"lg"}
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
        colorScheme="facebook"
        onClick={() => navigate("/")}
      >
        home
      </Button>
      {isAuthenticated() && (
        <Button
          borderRadius={"0"}
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faPen} />}
          colorScheme="facebook"
          onClick={() => navigate("/write")}
        >
          write
        </Button>
      )}
      <Spacer />
      {isAuthenticated() || (
        <Button
          borderRadius={"0"}
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
          colorScheme="facebook"
          onClick={() => navigate("/signup")}
        >
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button
          borderRadius={"0"}
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faUsers} />}
          colorScheme="facebook"
          onClick={() => navigate("/member/list")}
        >
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          borderRadius={"0"}
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faUser} />}
          colorScheme="facebook"
          onClick={() => navigate("/member?" + urlParams.toString())}
        >
          {login.nickName}님
        </Button>
      )}
      {isAuthenticated() || (
        <Button
          borderRadius={"0"}
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
          colorScheme="facebook"
          onClick={() => navigate("/login")}
        >
          로그인
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          borderRadius={"0"}
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faCircleXmark} />}
          colorScheme="facebook"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
