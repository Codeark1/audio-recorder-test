"use client";
import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import WaveSurfer from 'wavesurfer.js';

export default function App() {
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.error(err)
  );

  const [audioUrl, setAudioUrl] = useState('');
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    // recordingTime,
  } = recorderControls;

  const handleRecordingComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    if (wavesurfer.current) {
      wavesurfer.current.load(url);
    }
  };

  // Assign the recording complete handler
  useEffect(() => {
    if (recordingBlob) {
      handleRecordingComplete(recordingBlob);
    }
  }, [recordingBlob]);

  useEffect(() => {
    // Initialize WaveSurfer instance
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current as HTMLElement,
      waveColor: '#5f7dd8',
      progressColor: '#ff6347',
      cursorColor: '#333',
      height: 100,
      // responsive: true,
    });

    // Cleanup on unmount
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const playAudio = () => {
    if (wavesurfer.current) {
      wavesurfer.current.play();
    }
  };

  const pauseAudio = () => {
    if (wavesurfer.current) {
      wavesurfer.current.pause();
    }
  };

  const stopAudio = () => {
    if (wavesurfer.current) {
      wavesurfer.current.stop();
    }
  };

  const handleTogglePauseResume = () => {
    togglePauseResume();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', background : "green" }}>
      <h2>Custom Audio Recorder</h2>
      {/* <p>Recording Time: {recordingTime}s</p> */}
      {!isRecording ? (
        <button onClick={startRecording} style={{ padding: '10px', fontSize: '16px' }}>
          Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={{ padding: '10px', fontSize: '16px' }}>
          Stop Recording
        </button>
      )}

      <div ref={waveformRef} style={{ marginTop: '20px' }}></div>

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Recorded Audio:</h3>
          <audio src={audioUrl} controls />
          <div style={{ marginTop: '10px' }}>
            <button onClick={playAudio} style={{ padding: '5px', fontSize: '14px', marginRight: '5px' }}>
              Play
            </button>
            <button onClick={pauseAudio} style={{ padding: '5px', fontSize: '14px', marginRight: '5px' }}>
              Pause
            </button>
            <button onClick={stopAudio} style={{ padding: '5px', fontSize: '14px' }}>
              Stop
            </button>
            <button onClick={handleTogglePauseResume} style={{ padding: '5px', fontSize: '14px', marginLeft: '5px' }}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
