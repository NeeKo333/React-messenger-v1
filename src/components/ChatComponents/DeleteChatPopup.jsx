const DeleteChatPopup = ({ closePopup, submitHandler }) => {
  function closePopupHandler(e) {
    if (
      e.target.tagName !== "deleteChatPopupContent" &&
      e.target.tagName !== "BUTTON"
    )
      closePopup();
  }

  return (
    <div
      onClick={(e) => {
        closePopupHandler(e);
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
