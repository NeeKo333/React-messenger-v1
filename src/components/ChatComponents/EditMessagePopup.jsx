import { useState } from "react";

const EditMessagePopup = ({ submitHandler, closePopup, currentText }) => {
  const [previousText, setPreviousTex] = useState(currentText);

  function closePopupHandler(e) {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON")
      closePopup();
  }

  return (
    <div
      onClick={(e) => {
        closePopupHandler(e);
      }}
      className="edit-message-popup"
    >
      <form
        className="edit-message-popup-content"
        onSubmit={(e) => submitHandler(e)}
      >
        <input
          className="edit-message-input"
          type="text"
          placeholder="Edit message"
          value={previousText}
          onChange={(e) => setPreviousTex(e.target.value.slice(0, 250))}
        ></input>

        <div className="edit-message-popup-buttons">
          <button type="submit">Submit</button>
          <button onClick={closePopup}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default EditMessagePopup;
