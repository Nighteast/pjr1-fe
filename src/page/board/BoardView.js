import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FormLabel,
  Heading,
  Image,
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
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { LoginContext } from "../../component/LoginProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like === null) {
    return <Spinner />;
  }

  return (
    <Flex>
      <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요."}>
        <Button variant="ghost" size="xl" onClick={onClick}>
          {/*<FontAwesomeIcon icon={faHeart} size="xl" />*/}
          {like.like && <FontAwesomeIcon icon={fullHeart} size="xl" />}
          {like.like || <FontAwesomeIcon icon={emptyHeart} size="xl" />}
        </Button>
      </Tooltip>
      <Heading size={"xl"}>{like.countLike}</Heading>
    </Flex>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState("");

  // useDisclosure : Chakra UI의 Hook으로 다이얼로그, 모달, 팝업창 등의 상태와 이벤트 처리 관리
  // isOpen: 모달/다이얼로그 열려 있는지 여부(열릴때 true, 닫힐때 false)
  // onOpen/onClose : 각각 호출 시 모달 열림/닫힘
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  // navigate 라우터 내에서 다른 경로로 이동하게 도와주는 hook
  const navigate = useNavigate();

  // URL의 동적 경로 매개변수(dynamic path parameter)를 추출하는 코드
  const { id } = useParams();

  const { hasAccess, isAdmin } = useContext(LoginContext);

  // 초기 랜더링 시 id에 해당하는 게시물 데이터 가져와서 한 페이지 보기
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  useEffect(() => {
    axios
      .get("/api/like/board/" + id)
      .then((response) => setLike(response.data));
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

  // 좋아요 버튼 클릭 함수
  function handleLike() {
    axios
      .post("/api/like", { boardId: board.id })
      .then((response) => setLike(response.data))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      {/* 세로로 요소 정렬하고 간격 조절, align은 요소를 수직정렬, start는 위에서 아래로 */}
      <Center>
        <Card w={"lg"}>
          <CardHeader>
            <Flex justifyContent={"space-between"}>
              <Heading size="xl">{board.id}번 글 보기</Heading>
              <LikeContainer like={like} onClick={handleLike} />
            </Flex>
          </CardHeader>

          <CardBody>
            <FormControl mb={5}>
              <FormLabel>제목</FormLabel>
              <Input value={board.title} readOnly />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel>본문</FormLabel>
              <Textarea value={board.content} readOnly />
            </FormControl>

            {/* 이미지 출력 */}
            {board.files.map((file) => (
              <Card key={file.id} my={5}>
                <CardBody>
                  <Image width={"100%"} src={file.url} alt={file.name} />
                </CardBody>
              </Card>
            ))}

            <FormControl mb={5}>
              <FormLabel>작성자</FormLabel>
              <Input value={board.nickName} readOnly />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel>작성일시</FormLabel>
              <Input value={formattedDate} readOnly />
            </FormControl>
          </CardBody>

          <CardFooter>
            <Box>
              {(hasAccess(board.writer) || isAdmin(board.writer)) && (
                <Flex gap={2}>
                  <Button
                    colorScheme="purple"
                    onClick={() => navigate("/edit/" + id)}
                  >
                    수정
                  </Button>
                  <Button colorScheme="red" onClick={onOpen}>
                    삭제
                  </Button>
                </Flex>
              )}
            </Box>
          </CardFooter>
        </Card>
      </Center>

      <CommentContainer boardId={id} />

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
    </Box>
  );
}
