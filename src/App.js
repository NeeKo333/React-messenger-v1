import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from ".";
import "./App.scss";
import { publicRoutes, privateRoutes } from "./routes";
import { useNavigate } from "react-router-dom";

function App() {
  const { authUser } = useContext(AuthContext);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {!authUser
            ? publicRoutes.map((el) => (
                <Route
                  key={el.path}
                  path={el.path}
                  element={el.component}
                ></Route>
              ))
            : privateRoutes.map((el, index) => (
                <Route
                  key={el.path}
                  path={el.path}
                  element={el.component}
                ></Route>
              ))}
          <Route
            path="*"
            element={<Navigate to={!authUser ? "/login" : "/chat"}></Navigate>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
