const Preview = ({ previwSrc, deletePreview }) => {
  return (
    <div className="message-preview" onClick={deletePreview}>
      <span className="message-preview-delete">
        <img src="/img/closePreview.png"></img>
      </span>
      <img className="message-photo-preview" src={previwSrc}></img>
    </div>
  );
};

export default Preview;
