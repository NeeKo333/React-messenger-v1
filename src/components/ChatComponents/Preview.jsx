const Preview = ({ previwSrc, deletePreview }) => {
  return (
    <div className="messagePreview" onClick={deletePreview}>
      <span className="messagePreviewDelete">
        <img src="/img/closePreview.png"></img>
      </span>
      <img className="messagePhotoPreview" src={previwSrc}></img>
    </div>
  );
};

export default Preview;
