import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardList } from "./page/BoardList";
import { BoardWrite } from "./page/BoardWrite";
import { BoardView } from "./page/BoardView";
import { BoardEdit } from "./page/BoardEdit";

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
    </Route>,
  ),
);

function App(props) {
  // 라우터 제공하기
  return <RouterProvider router={routes} />;
}

export default App;
