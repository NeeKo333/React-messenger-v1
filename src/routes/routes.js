import Home from "../components/Pages/Home";
import Login from "../components/Pages/Login";
import Registration from "../components/Pages/Registration";

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
