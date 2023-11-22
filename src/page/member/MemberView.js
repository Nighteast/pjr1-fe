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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider";

export function MemberView() {
  const [member, setMember] = useState(null);
  // /member?id=userid
  const [params] = useSearchParams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data))
      .catch((error) => {
        navigate("/login");
        toast({
          description: "권한이 없습니다.",
          status: "warning",
        });
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDelete() {
    // axios
    // delete /api/member?id=userId

    // ok -> home 이동, toast
    // error -> toast
    // final - modal close

    axios
      .delete("api/member?" + params.toString())
      .then(() => {
        toast({
          description: "회원 탈퇴하였습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "탈퇴 처리 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        onClose();
      });
  }

  return (
    <Center>
      <Card w={"xl"}>
        <CardHeader>
          <Heading>{member.id} 님 정보</Heading>
        </CardHeader>

        <CardBody>
          {/* password */}
          <FormControl mb={2}>
            <FormLabel>password</FormLabel>
            <Input type="text" value={member.password} readOnly />
          </FormControl>

          {/* nickName */}
          <FormControl mb={2}>
            <FormLabel>nickName</FormLabel>
            <Input type="text" value={member.nickName} readOnly />
          </FormControl>

          {/* email */}
          <FormControl mb={2}>
            <FormLabel>email</FormLabel>
            <Input type="text" value={member.email} readOnly />
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={2}>
            <Button
              onClick={() => navigate("/member/edit?" + params.toString())}
              colorScheme="purple"
            >
              수정
            </Button>

            <Button onClick={onOpen} colorScheme="red">
              탈퇴
            </Button>
          </Flex>
        </CardFooter>
      </Card>

      {/* 탈퇴 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>탈퇴 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>탈퇴 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
