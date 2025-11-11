import './Avatar.css';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  onUpload,
  editable = false,
  className = ''
}) => {
  return (
    <div className={`avatar avatar--${size} ${className}`}>
      <img src={src} alt={alt} className="avatar-image" />
      {editable && (
        <>
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            onChange={onUpload}
            className="avatar-input"
          />
          <label htmlFor="avatar-upload" className="avatar-overlay">
            <span>📷</span>
          </label>
        </>
      )}
    </div>
  );
};

export default Avatar;
