import { Camera, CameraOff } from 'lucide-react'

function MediaControls({
  isCameraEnabled,
  onToggleCamera,
}) {
  return (
    <div
      className="media-controls"
      aria-label="Camera controls"
    >
      <button
        className={
          isCameraEnabled
            ? 'media-control media-control--active'
            : 'media-control'
        }
        type="button"
        onClick={onToggleCamera}
        aria-label={
          isCameraEnabled
            ? 'Turn camera off'
            : 'Turn camera on'
        }
        title={
          isCameraEnabled
            ? 'Turn camera off'
            : 'Turn camera on'
        }
      >
        {isCameraEnabled ? (
          <Camera size={17} />
        ) : (
          <CameraOff size={17} />
        )}

        <span>
          Camera {isCameraEnabled ? 'On' : 'Off'}
        </span>
      </button>
    </div>
  )
}

export default MediaControls
