import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
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
  faCaretLeft,
  faCaretRight,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

// 페이지네이션
function Pagination({ pageInfo }) {
  const pageNumbers = [];

  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <Button
          varient={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </Button>
      )}

      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          varient={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          onClick={() => navigate("/?p=" + pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      {pageInfo.nextPageNumber && (
        <Button
          varient={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </Button>
      )}
    </Box>
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
      <h1>게시물 목록</h1>
      <Box>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
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
                </Td>
                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {/* 페이지네이션 */}
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
