import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registration from "./components/pages/Registration";

export const publicRoutes = [
  {
    path: "login",
    component: <Login></Login>,
  },
  {
    path: "registration",
    component: <Registration></Registration>,
  },
];

export const privateRoutes = [
  {
    path: "chat",
    component: <Home></Home>,
  },
];
