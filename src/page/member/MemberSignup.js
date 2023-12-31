import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);
  const [nickNameAvailable, setNickNameAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // submitAvailable이 true 일때만 버튼이 활성화 되게 한다.
  let submitAvailable = true;

  if (!emailAvailable) {
    submitAvailable = false;
  }

  // id, nickName 중 하나라도 중복체크가 안 될 경우 제출 할 수 없다.
  if (!idAvailable || !nickNameAvailable) {
    submitAvailable = false;
  }

  if (password != passwordCheck) {
    submitAvailable = false;
  }
  if (password.length === 0) {
    submitAvailable = false;
  }

  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        nickName,
        email,
      })
      .then(() => {
        // toast
        toast({
          description: "회원가입이 완료되었습니다.",
          status: "success",
        });
        // navigate
        navigate("/");
      })
      .catch((error) => {
        // toast
        if (error.response.status === 400) {
          toast({
            description: "입력 값을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "가입 중 오류가 발생하였습니다.",
            status: "error",
          });
        }
      });
  }

  function handleIdCheck() {
    // URL 엔코딩을 해야해서 id를 쿼리스트링으로 바로 가져올 수 가 없다.
    // 때문에 URLSearchParams라는 엔코딩을 대신 해주는 객체를 사용한다.
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    // URL 엔코딩을 한 결과를 toString으로 받아 쿼리스트링으로 get요청을 보낸다.
    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "이미 사용 중인 ID입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      });
  }

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params.toString())
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용중인 닉네임입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 닉네임입니다.",
            status: "success",
          });
        }
      });
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("api/member/check?" + params.toString())
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 이메일입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 이메일 입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Center>
      <Card w={"xl"}>
        <CardHeader>
          <Heading>회원 가입</Heading>
        </CardHeader>

        <CardBody>
          {/* ID */}
          <FormControl mb={2} isInvalid={!idAvailable}>
            <FormLabel>id</FormLabel>
            <Flex gap={2}>
              <Input
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setIdAvailable(false);
                }}
              />
              <Button onClick={handleIdCheck}>중복확인</Button>
            </Flex>
            <FormErrorMessage>중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>

          {/* password */}
          <FormControl mb={2} isInvalid={password.length === 0}>
            <FormLabel>password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
          </FormControl>

          {/* passwordCheck */}
          <FormControl mb={2} isInvalid={password != passwordCheck}>
            <FormLabel>password 확인</FormLabel>
            <Input
              type="password"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
          </FormControl>

          {/* nickName */}
          <FormControl mb={2} isInvalid={!nickNameAvailable}>
            <FormLabel>nickName</FormLabel>
            <Flex gap={2}>
              <Input
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                  setNickNameAvailable(false);
                }}
              />
              <Button onClick={handleNickNameCheck}>중복확인</Button>
            </Flex>
            <FormErrorMessage>중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>

          {/* email */}
          <FormControl mb={2} isInvalid={!emailAvailable}>
            <FormLabel>email</FormLabel>
            <Flex gap={2}>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmailAvailable(false);
                  setEmail(e.target.value);
                }}
              />
              <Button onClick={handleEmailCheck}>중복체크</Button>
            </Flex>
            <FormErrorMessage>email 중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Button
            isDisabled={!submitAvailable}
            onClick={handleSubmit}
            colorScheme="blue"
          >
            가입
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}
