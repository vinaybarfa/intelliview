import { CameraOff, ShieldAlert } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function CameraPreview({
  stream,
  isCameraEnabled,
  permissionError,
  onRequestMedia,
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.srcObject = stream || null
  }, [stream])

  const showPermission = !stream && permissionError
  const isLive = Boolean(stream && isCameraEnabled)

  return (
    <motion.section
      className="camera-preview glass-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Camera preview"
    >
      <div className="camera-preview__header">
        <span>Candidate camera</span>

        <i
          className={
            isLive
              ? ''
              : 'camera-preview__status--idle'
          }
        >
          <b />
          {isLive ? 'LIVE' : 'OFF'}
        </i>
      </div>

      <div className="camera-preview__frame">
        {isLive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Your live camera preview"
          />
        )}

        {showPermission ? (
          <div className="camera-preview__placeholder camera-preview__placeholder--permission">
            <ShieldAlert size={27} />

            <strong>
              Camera access is required to show your preview.
            </strong>

            <button
              className="button button--small"
              type="button"
              onClick={onRequestMedia}
            >
              Enable camera
            </button>
          </div>
        ) : (
          !stream ||
          (!isCameraEnabled && (
            <div className="camera-preview__placeholder">
              <CameraOff size={29} />

              <strong>
                Camera is off
              </strong>

              <span>
                Enable it when you are ready to be seen.
              </span>
            </div>
          ))
        )}
      </div>
    </motion.section>
  )
}

export default CameraPreview
