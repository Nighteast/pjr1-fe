import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
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
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";

export function BoardView() {
  const [board, setBoard] = useState(null);

  // useDisclosure : Chakra UI의 Hook으로 다이얼로그, 모달, 팝업창 등의 상태와 이벤트 처리 관리
  // isOpen: 모달/다이얼로그 열려 있는지 여부(열릴때 true, 닫힐때 false)
  // onOpen/onClose : 각각 호출 시 모달 열림/닫힘
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  // navigate 라우터 내에서 다른 경로로 이동하게 도와주는 hook
  const navigate = useNavigate();

  // URL의 동적 경로 매개변수(dynamic path parameter)를 추출하는 코드
  const { id } = useParams();

  // 초기 랜더링 시 id에 해당하는 게시물 데이터 가져와서 한 페이지 보기
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  // board가 null일때 스피너 돌리기
  if (board === null) {
    return <Spinner />;
  }

  // 삭제 버튼 온 클릭시 함수
  function handleDelete() {
    axios
      // delete요청 보내기
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  // LocalDateTime을 원하는 형식으로 포맷
  const formattedDate = format(
    new Date(board.inserted),
    "yyyy년 MM월 dd일 HH:mm:ss",
  );

  return (
    <Box p={6}>
      {/* 세로로 요소 정렬하고 간격 조절, align은 요소를 수직정렬, start는 위에서 아래로 */}
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
          <Input value={formattedDate} readOnly />
        </FormControl>
        <Flex gap={"10px"}>
          <Button colorScheme="purple" onClick={() => navigate("/edit/" + id)}>
            수정
          </Button>
          <Button colorScheme="red" onClick={onOpen}>
            삭제
          </Button>
          {/* 삭제 모달 */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>삭제 확인</ModalHeader>
              <ModalCloseButton />
              <ModalBody>삭제 하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>닫기</Button>
                <Button onClick={handleDelete} colorScheme="red">
                  삭제
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </VStack>
    </Box>
  );
}
