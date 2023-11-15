import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Heading size="md">댓글 작성</Heading>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

// 댓글 목록
function CommentList({
  commentList,
  onEditModalOpen,
  onDeleteModalOpen,
  isSubmitting,
}) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize="xs">{comment.inserted}</Text>
              </Flex>

              <Flex justifyContent="space-between" alignItems="center">
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {comment.comment}
                </Text>
                {hasAccess(comment.memberId) && (
                  <Box>
                    <Button
                      isDisabled={isSubmitting}
                      onClick={() => onEditModalOpen(comment.id)}
                      size="xs"
                      colorScheme="blue"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      isDisabled={isSubmitting}
                      onClick={() => onDeleteModalOpen(comment.id)}
                      size="xs"
                      colorScheme="red"
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                )}
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

// 댓글 컨테이너
export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const {
    isOpen: isDeleteModalOpen,
    onClose: onDeleteModalClose,
    onOpen: onDeleteModalOpen,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onClose: onEditModalClose,
    onOpen: onEditModalOpen,
  } = useDisclosure();

  const toast = useToast();

  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  const commentIdRef = useRef(0);

  const { isAuthenticated } = useContext(LoginContext);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  // 댓글 쓰기 기능
  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "댓글 등록 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  // 댓글 수정 기능
  function handleEdit() {
    setIsSubmitting(true);
    axios
      .put("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 수정 중 문제가 발생하였습니다",
            status: "error",
          });
        }
      })
      .finally(() => {
        onEditModalClose();
        setIsSubmitting(false);
      });
  }

  // 댓글 삭제 기능
  function handleDelete() {
    // console.log(id + "번 댓글 삭제");
    // TODO: 모달, then, catch, finally

    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        onDeleteModalClose();
        setIsSubmitting(false);
      });
  }

  // 댓글 삭제 모달 오픈
  function handleDeleteModalOpen(id) {
    // id 를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onDeleteModalOpen();
  }
  // 댓글 수정 모달 오픈
  function handleEditModalOpen(id) {
    // id 를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onEditModalOpen();
  }

  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}

      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
        onEditModalOpen={handleEditModalOpen}
      />
      {/* 수정 모달 */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onEditModalClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleEdit}
              colorScheme="blue"
            >
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 삭제 모달 */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onDeleteModalClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
