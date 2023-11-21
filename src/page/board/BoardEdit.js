import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardEdit() {
  // useImmer 사용, 상태를 생성
  const [board, updateBoard] = useImmer(null);
  const [uploadFiles, setUploadFiles] = useState(null);

  // /edit/:id 이므로 useParams로 URL에서 게시글 ID가져오기
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  // 모달에 사용할 disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  // 게시글을 로딩중이라면 스피너 돌리기
  if (board === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    // 저장 버튼 클릭 시
    // PUT /api/board/edit (업데이트 시 PUT, PATCH 방식이 주로 쓰인다)
    axios
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          description: board.id + "번 게시글이 수정되었습니다.",
          status: "success",
        });

        navigate("/board/" + id);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "요청이 잘못되었습니다.",
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

  function deleteImage(id) {}

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

      {/* 이미지 출력 */}
      {board.files.map((file) => (
        <Box key={file.id} my={"5px"} border={"3px solid black"}>
          <Image width={"100%"} src={file.url} alt={file.name} />
          <Text>{file.name}</Text>
        </Box>
      ))}

      <FormControl>
        <FormLabel>이미지 첨부</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        {/* 이미지 파일명을 텍스트로 표시, 이미지 개별 삭제 기능 */}
        {board.files.map((file) => (
          <Flex key={file.id} my={"5px"} border={"3px solid black"}>
            <Text>{file.name}</Text>
            <Button
              size={"xs"}
              colorScheme="red"
              onClick={() => deleteImage(file.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Flex>
        ))}
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
        </FormHelperText>
      </FormControl>

      <Button colorScheme="blue" onClick={onOpen}>
        수정
      </Button>

      {/* 모달 버튼 작성 */}
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>수정완료</ModalHeader>
            <ModalBody>수정 하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSubmit}>
                수정
              </Button>
              <Button onClick={onClose}>닫기</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* navigate(-1) 이전경로, -2는 2페이지 전 경로, +1은 다음 경로 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
