import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { AuthContextProvider } from "./core/context/authContext";
import { ChatContextProvider } from "./core/context/chatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </AuthContextProvider>
);
