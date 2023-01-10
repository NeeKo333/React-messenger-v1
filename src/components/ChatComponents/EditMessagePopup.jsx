import { useState } from "react";

const EditMessagePopup = ({ submitHandler, closePopup, currentText }) => {
  const [previousText, setPreviousTex] = useState(currentText);
  return (
    <div
      onClick={(e) => {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON")
          closePopup();
      }}
      className="EditMessagePopup"
    >
      <form
        className="EditMessagePopupContent"
        onSubmit={(e) => submitHandler(e)}
      >
        <input
          className="editMessageInput"
          type="text"
          placeholder="Edit message"
          value={previousText}
          onChange={(e) => setPreviousTex(e.target.value)}
        ></input>
        <div className="EditMessagePopupButtons">
          <button type="submit">Submit</button>
          <button onClick={closePopup}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default EditMessagePopup;
