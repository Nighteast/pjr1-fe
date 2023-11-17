import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);

function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  // 서버에서 로그인 세션 정보를 받아옴.
  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }

  // 로그인 했는지 첫 렌더링 때 확인
  useEffect(() => {
    fetchLogin();
  }, []);

  // 로그인 여부 확인
  function isAuthenticated() {
    return login !== "";
  }

  // 권한 확인
  function isAdmin() {
    if (login.auth) {
      return login.auth.some((elem) => elem.name === "admin");
    } else {
      return false;
    }
  }

  // function hasAuth(auth) {
  //   return login.auth.some((elem) => elem.name === auth);
  // }

  // 자기가 쓴 글이면 보이기, 아니면 안 보이기
  function hasAccess(userId) {
    return login.id === userId;
  }

  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
