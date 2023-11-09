import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import { NavBar } from "../component/NavBar";

export function HomeLayout() {
  return (
    <Box>
      <NavBar />
      {/* 라우팅 중에 현재 경로에 맞는 하위 라우트를 렌더링 */}
      <Outlet />
    </Box>
  );
}
