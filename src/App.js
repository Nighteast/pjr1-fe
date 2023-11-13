import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardList } from "./page/board/BoardList";
import { BoardWrite } from "./page/board/BoardWrite";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import { MemberSignup } from "./page/member/MemberSignup";
import { MemberList } from "./page/member/MemberList";
import { MemberView } from "./page/member/MemberView";
import { MemberEdit } from "./page/member/MemberEdit";

// router 생성
const routes = createBrowserRouter(
  createRoutesFromElements(
    // HomeLayout은 기본 경로 localhost:3000/
    <Route path="/" element={<HomeLayout />}>
      {/* index는 "/" 기본 경로에 해당하는 element 지정 */}
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      {/* "/:"는 동적 매개변수를 지정, URL에서 id 파라미터 값을 캡쳐한다. */}
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />} />
      <Route path="signup" element={<MemberSignup />} />
      <Route path="member/list" element={<MemberList />} />
      <Route path="member" element={<MemberView />} />
      <Route path="member/edit" element={<MemberEdit />} />
    </Route>,
  ),
);

function App(props) {
  // 라우터 제공하기
  return <RouterProvider router={routes} />;
}

export default App;
