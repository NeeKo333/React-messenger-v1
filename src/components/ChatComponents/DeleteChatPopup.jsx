const DeleteChatPopup = ({ closePopup, submitHandler }) => {
  function closePopupHandler(e) {
    if (
      e.target.tagName !== "delete-chat-popup-content" &&
      e.target.tagName !== "BUTTON"
    )
      closePopup();
  }

  return (
    <div
      onClick={(e) => {
        closePopupHandler(e);
      }}
      className="delete-chat-popup"
    >
      <form
        className="delete-chat-popup-content"
        onSubmit={(e) => submitHandler(e)}
      >
        <div>Do you really want to delete the chat?</div>
        <div className="delete-chat-popup-buttons">
          <button type="submit">Submit</button>
          <button onClick={closePopup}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default DeleteChatPopup;
