import { useCallback, useEffect, useRef, useState } from "react";

const friendlyMediaError = (error) => {
  if (error?.name === "NotAllowedError" || error?.name === "SecurityError")
    return "Camera & microphone access is required for the interview experience.";
  if (error?.name === "NotFoundError")
    return "A camera or microphone could not be found. Please check your device connection.";
  if (error?.name === "NotReadableError")
    return "Camera access is unavailable. Please check whether another application is using your device.";
  return "Camera access is unavailable. Please check your browser permissions.";
};

function useInterviewMedia(enabled = true) {
  const streamRef = useRef(null);
  const mountedRef = useRef(true);
  const [stream, setStream] = useState(null);
  const [isCameraEnabled, setCameraEnabled] = useState(false);
  const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(false);
  const [isMediaActive, setMediaActive] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (mountedRef.current) {
      setStream(null);
      setMediaActive(false);
      setCameraEnabled(false);
      setMicrophoneEnabled(false);
    }
  }, []);

  const requestMedia = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionError("Camera access is unavailable in this browser.");
      return;
    }
    stopMedia();
    setPermissionError("");
    try {
      // SpeechRecognition owns its audio capture. Requesting a second audio
      // stream here makes Chromium end recognition immediately on some devices.
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (!mountedRef.current) {
        nextStream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = nextStream;
      setStream(nextStream);
      setMediaActive(true);
      setCameraEnabled(true);
      setMicrophoneEnabled(false);
    } catch (error) {
      if (mountedRef.current) setPermissionError(friendlyMediaError(error));
    }
  }, [stopMedia]);

  const toggleCamera = useCallback(async () => {
    if (!streamRef.current && !isCameraEnabled) {
      await requestMedia();
      return;
    }
    if (!streamRef.current) return;
    const enabled = !isCameraEnabled;
    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
    setCameraEnabled(enabled);
  }, [isCameraEnabled, requestMedia]);
  const toggleMicrophone = useCallback(() => {
    if (!streamRef.current) return;
    const enabled = !isMicrophoneEnabled;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
    setMicrophoneEnabled(enabled);
  }, [isMicrophoneEnabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled) return undefined;
    const requestTimer = window.setTimeout(requestMedia, 0);
    return () => {
      window.clearTimeout(requestTimer);
      mountedRef.current = false;
      stopMedia();
    };
  }, [enabled, requestMedia, stopMedia]);

  return {
    stream,
    isCameraEnabled,
    isMicrophoneEnabled,
    isMediaActive,
    permissionError,
    requestMedia,
    toggleCamera,
    toggleMicrophone,
  };
}

export default useInterviewMedia;
