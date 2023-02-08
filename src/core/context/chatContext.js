import { useContext, createContext, useReducer } from "react";
import { AuthContext } from "./authContext";

export const ChatContext = createContext(null);

export const ChatContextProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);

  const initialState = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "change_user":
        return {
          user: action.payload,
          chatId:
            authUser.uid > action.payload.uid
              ? authUser.uid + action.payload.uid
              : action.payload.uid + authUser.uid,
        };
      case "reset": {
        return initialState;
      }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
