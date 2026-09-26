import { useCallback, useEffect, useRef, useState } from "react";

const messageFor = (error) => {
  if (error === "not-allowed" || error === "service-not-allowed")
    return "Microphone permission was denied. Allow microphone access in your browser, then try again.";
  if (error === "audio-capture")
    return "No microphone was found. Check your selected input device and try again.";
  if (error === "network")
    return "Browser speech service unavailable. This browser cannot reach its speech-recognition service; type your answer or use a browser/service with native speech recognition enabled.";
  if (error === "no-speech")
    return "No speech was detected. Keep speaking or stop and try again.";
  if (error === "language-not-supported")
    return "Your browser speech service does not support the selected language.";
  if (error === "aborted") return "Speech recognition was stopped.";
  return `Speech recognition failed${error ? ` (${error})` : ""}. You can try again or continue typing your answer.`;
};

const combine = (...parts) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

function useSpeechRecognition() {
  const recognitionRef = useRef(null);
  const desiredRef = useRef(false);
  const restartTimerRef = useRef(null);
  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const startRef = useRef(null);
  const [transcript, setTranscriptState] = useState("");
  const [isListening, setListening] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const Recognition =
    typeof window === "undefined"
      ? null
      : window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = Boolean(Recognition);

  const stopListening = useCallback(() => {
    desiredRef.current = false;
    window.clearTimeout(restartTimerRef.current);
    setProcessing(false);
    setListening(false);
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.stop();
  }, []);

  const setTranscript = useCallback((value) => {
    const next =
      typeof value === "function" ? value(transcriptRef.current) : value;
    transcriptRef.current = next;
    finalTranscriptRef.current = next;
    setTranscriptState(next);
  }, []);

  const clearTranscript = useCallback(() => {
    stopListening();
    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    setTranscriptState("");
    setError("");
  }, [stopListening]);

  const startListening = useCallback(() => {
    if (!Recognition) {
      setError(
        "Speech-to-text isn't supported in this browser. You can type your answer instead.",
      );
      return;
    }
    if (recognitionRef.current) return;

    desiredRef.current = true;
    setError("");
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = navigator.language || "en-US";
    recognition.onstart = () => {
      if (!desiredRef.current) return;
      setProcessing(false);
      setListening(true);
    };
    recognition.onresult = (event) => {
      let interim = "";
      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const result = event.results[index];
        const value = result[0]?.transcript?.trim();
        if (!value) continue;
        if (result.isFinal)
          finalTranscriptRef.current = combine(
            finalTranscriptRef.current,
            value,
          );
        else interim = combine(interim, value);
      }
      const next = combine(finalTranscriptRef.current, interim);
      transcriptRef.current = next;
      setTranscriptState(next);
      setProcessing(Boolean(interim));
      setListening(desiredRef.current);
    };
    recognition.onerror = (event) => {
      if (import.meta.env.DEV)
        console.debug("Speech recognition error:", event.error);
      if (event.error === "aborted") {
        if (desiredRef.current) setError(messageFor(event.error));
        return;
      }
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture" ||
        event.error === "network"
      ) {
        desiredRef.current = false;
        recognitionRef.current = null;
        setProcessing(false);
        setListening(false);
        setError(messageFor(event.error));
        return;
      }
      if (event.error === "language-not-supported") {
        desiredRef.current = false;
        recognitionRef.current = null;
        setProcessing(false);
        setListening(false);
        setError(messageFor(event.error));
        return;
      }
      if (event.error === "no-speech") setError(messageFor(event.error));
      else setError(messageFor(event.error));
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setProcessing(false);
      if (!desiredRef.current) {
        setListening(false);
        return;
      }
      setListening(false);
      restartTimerRef.current = window.setTimeout(() => {
        if (desiredRef.current) startRef.current?.();
      }, 250);
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      desiredRef.current = false;
      setListening(false);
      setProcessing(false);
      setError(
        "Speech recognition could not start. Check microphone permissions and try again.",
      );
    }
  }, [Recognition]);

  startRef.current = startListening;
  const toggleListening = useCallback(() => {
    if (desiredRef.current) stopListening();
    else startListening();
  }, [startListening, stopListening]);

  useEffect(
    () => () => {
      desiredRef.current = false;
      window.clearTimeout(restartTimerRef.current);
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    },
    [],
  );

  return {
    transcript,
    isListening,
    isProcessing,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    setTranscript,
  };
}

export default useSpeechRecognition;
