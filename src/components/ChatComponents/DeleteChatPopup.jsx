import React from "react";
const DeleteChatPopup = ({ closePopup, submitHandler }) => {
  return (
    <div
      onClick={(e) => {
        if (
          e.target.tagName !== "deleteChatPopupContent" &&
          e.target.tagName !== "BUTTON"
        )
          closePopup();
      }}
      className="deleteChatPopup"
    >
      <form
        className="deleteChatPopupContent"
        onSubmit={(e) => submitHandler(e)}
      >
        <div>Do you really want to delete the chat?</div>
        <div className="deleteChatPopupButtons">
          <button type="submit">Submit</button>
          <button onClick={closePopup}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default DeleteChatPopup;
