"use client";
import { useState, useRef, useEffect } from 'react';
import { useToggle } from 'react-use';
import { saveAs } from 'file-saver';

if (typeof window !== 'undefined') {
  if (!window.MediaRecorder) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    window.MediaRecorder = require('audio-recorder-polyfill');
  }
}

const AudioRecorder = () => {
  const [isRecording, toggleRecording] = useToggle(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioURLRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          audioBlobRef.current = audioBlob;
          audioURLRef.current = window.URL.createObjectURL(audioBlob);

          // Update audio source and reload
          if (audioRef.current) {
            audioRef.current.src = audioURLRef.current;
            audioRef.current.load(); // Force reload of the audio element
          }
          setAudioChunks([]); // Clear chunks after stopping
        }
      };

      mediaRecorderRef.current.start();
      toggleRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      toggleRecording(false);
    }
  };

  const saveRecording = () => {
    if (audioBlobRef.current) {
      saveAs(audioBlobRef.current, 'recording.webm');
    }
  };

  useEffect(() => {
    // Cleanup object URLs after component unmounts to prevent memory leaks
    return () => {
      if (audioURLRef.current) {
        window.URL.revokeObjectURL(audioURLRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>Audio Recorder</h2>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioURLRef.current && (
        <div>
          <h3>Recording Playback</h3>
          <audio ref={audioRef} controls />
          <button onClick={saveRecording}>Save Recording</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
