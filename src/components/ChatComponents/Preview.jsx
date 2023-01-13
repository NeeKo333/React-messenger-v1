const Preview = ({ previwSrc, deletePreview }) => {
  return (
    <div className="messagePreview" onClick={deletePreview}>
      <span className="messagePreviewDelete">X</span>
      <img className="messagePhotoPreview" src={previwSrc}></img>
    </div>
  );
};

export default Preview;
