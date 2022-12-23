import { useContext } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from ".";
import "./App.scss";
import { publicRoutes, privateRoutes } from "./routes";

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
            : privateRoutes.map((el) => (
                <Route
                  key={el.path}
                  path={el.path}
                  element={el.component}
                ></Route>
              ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
