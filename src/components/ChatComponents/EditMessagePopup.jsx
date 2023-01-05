const EditMessagePopup = ({ submitHandler, closePopup }) => {
  return (
    <div
      onClick={(e) => {
        if (e.target.tagName !== "INPUT") closePopup();
      }}
      className="EditMessagePopup"
    >
      <form onSubmit={(e) => submitHandler(e)}>
        <input
          className="editMessageInput"
          type="text"
          placeholder="Edit message"
        ></input>
      </form>
    </div>
  );
};

export default EditMessagePopup;
