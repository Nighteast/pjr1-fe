import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();
  const [params] = useSearchParams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
      setNickName(response.data.nickName);
    });
  }, []);

  const id = params.get("id");

  // 기존 닉네임과 같은지?
  let sameOriginNickName = false;

  if (member !== null) {
    sameOriginNickName = member.nickName === nickName;
  }

  let nickNameChecked = sameOriginNickName || nickNameAvailable;

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  let emailChecked = sameOriginEmail || emailAvailable;

  // 암호가 없으면 기존 암호
  // 암호를 작성하면 새 암호, 암호 확인 체크
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (password.length === 0) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  // 이메일 중복 확인
  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  // 닉네임 중복 확인
  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용 중인 닉네임입니다.",
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

  // 수정 버튼 클릭시 요청, 성공, 오류, 최종
  function handleSubmit() {
    // put /api/member/edit {id, password, nickName, email}

    axios
      .put("/api/member/edit", { id: member.id, password, nickName, email })
      .then(() => {
        toast({
          description: "회원정보가 수정되었습니다.",
          status: "success",
        });
        navigate("/member?" + params.toString());
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "수정 권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  return (
    <Center>
      <Card>
        <CardHeader>
          <Heading>{id}님 정보 수정</Heading>
        </CardHeader>

        <CardBody>
          <FormControl mb={5}>
            <FormLabel>password</FormLabel>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormHelperText>
              작성하지 않으면 기존 암호를 유지합니다.
            </FormHelperText>
          </FormControl>

          {password.length > 0 && (
            <FormControl mb={5}>
              <FormLabel>password 확인</FormLabel>
              <Input
                type="text"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </FormControl>
          )}

          {/*  nickName을 변경하면(작성시작) 중복확인 다시 하도록  */}
          {/*  기존 nickName과 같으면 중복확인 안해도됨 */}
          <FormControl mb={5}>
            <FormLabel>nickName</FormLabel>
            <Flex>
              <Input
                type="nickName"
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                  setNickNameAvailable(false);
                }}
              />
              <Button
                isDisabled={nickNameChecked}
                onClick={handleNickNameCheck}
              >
                중복확인
              </Button>
            </Flex>
          </FormControl>

          {/*  email을 변경하면(작성시작) 중복확인 다시 하도록  */}
          {/*  기존 email과 같으면 중복확인 안해도됨 */}
          <FormControl mb={5}>
            <FormLabel>email</FormLabel>
            <Flex>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailAvailable(false);
                }}
              />
              <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
                중복확인
              </Button>
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Box>
            <Button
              isDisabled={!emailChecked || !passwordChecked || !nickNameChecked}
              colorScheme="blue"
              onClick={onOpen}
            >
              수정
            </Button>
          </Box>
        </CardFooter>
      </Card>

      {/* 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
