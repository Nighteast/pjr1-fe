import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faHeart,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

// 페이지 이동 버튼
function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

// 페이지네이션
function Pagination({ pageInfo }) {
  const pageNumbers = [];

  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center mt={"5"} mb={"40"}>
      <Box>
        {/* 최초 페이지 이동 */}
        {pageInfo.initialPageNumber && (
          <Button varient={"ghost"} onClick={() => navigate("/?p=" + 1)}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
        )}

        {/* 이전 페이지 집합 이동 */}
        {pageInfo.prevPageNumber && (
          <PageButton variant={"ghost"} pageNumber={pageInfo.prevPageNumber}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </PageButton>
        )}

        {/* 선택 페이지 이동 */}
        {pageNumbers.map((pageNumber) => (
          <PageButton
            key={pageNumber}
            colorScheme={
              pageNumber === pageInfo.currentPageNumber ? "teal" : "gray"
            }
            pageNumber={pageNumber}
          >
            {pageNumber}
          </PageButton>
        ))}

        {/* 다음 페이지 집합 이동 */}
        {pageInfo.nextPageNumber && (
          <PageButton varient={"ghost"} pageNumber={pageInfo.nextPageNumber}>
            <FontAwesomeIcon icon={faAngleRight} />
          </PageButton>
        )}

        {/* 마지막 페이지 이동 */}
        <Button
          varient={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.lastPageNumber)}
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </Button>
      </Box>
    </Center>
  );
}

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  function handleSearch() {
    // /?k=keyword&c=all
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);

    navigate("/?" + params);
  }

  return (
    <Flex>
      <Select width={"150px"} onChange={(e) => setCategory(e.target.value)}>
        <option selected value="all">
          전체
        </option>
        <option value="title">제목</option>
        <option value="content">본문</option>
      </Select>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>검색</Button>
    </Flex>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 초기 렌더링 시 게시물 리스트 가져오기
  useEffect(() => {
    axios.get("/api/board/list?" + params.toString()).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  // localdatetime을 원하는 형식으로 변환하는 함수
  // const formatLocalDateTime = (datetime) => {
  //   return format(new Date(datetime), "yyyy-MM-dd HH:mm:ss");
  // };

  return (
    <Box>
      <Heading>게시물 목록</Heading>
      <Box>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th w={"70px"}>id</Th>
              <Th w={"50px"}>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>title</Th>
              <Th w={"150px"}>by</Th>
              <Th w={"150px"}>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* boardList 배열 내의 각 요소를 순회하면서 각 요소에 대한 UI를 생성 */}
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                  background: "cornsilk",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.countLike != 0 && board.countLike}</Td>
                <Td>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge>
                      <ChatIcon />
                      {board.countComment}
                    </Badge>
                  )}
                  {board.countFile > 0 && (
                    <Badge>
                      <FontAwesomeIcon icon={faImage} />
                      {board.countFile}
                    </Badge>
                  )}
                </Td>
                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* 검색 */}
      <SearchComponent />

      {/* 페이지네이션 */}
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
