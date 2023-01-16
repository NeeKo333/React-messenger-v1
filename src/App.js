import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from ".";
import "./App.scss";
import { publicRoutes, privateRoutes } from "./routes";
import Preloader from "./components/ChatComponents/Preloader";

function App() {
  const { authUser } = useContext(AuthContext);

  if (authUser === "")
    return (
      <div className="preloaderApp">
        <Preloader></Preloader>
      </div>
    );
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
            : privateRoutes.map((el) => (
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
