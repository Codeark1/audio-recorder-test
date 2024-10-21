// 


"use client"
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

export default function App() {
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err: any) => console.table(err) // onNotAllowedOrFound
  );
  const addAudioElement = (blob: Blob | MediaSource) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div>
      <AudioRecorder
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRecordingComplete={(blob: any) => addAudioElement(blob)}
        recorderControls={recorderControls}
        // downloadOnSavePress={true}
        // downloadFileExtension="mp3"
        showVisualizer={true}
      />
      <br />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
      <br />
    </div>
  );
}


