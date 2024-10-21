// // components/AudioUploader.tsx

// import React, { useState, useEffect } from 'react';
// import { Visualizer } from 'react-voice-visualizer';

// const AudioUploader: React.FC = () => {
//   const [audioSrc, setAudioSrc] = useState<string | null>(null);
//   const [audioData, setAudioData] = useState<Float32Array | null>(null);

//   useEffect(() => {
//     if (audioSrc) {
//       const fetchAudioData = async () => {
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const response = await fetch(audioSrc);
//         const audioBuffer = await response.arrayBuffer();
//         const decodedAudioData = await audioContext.decodeAudioData(audioBuffer);
        
//         const analyser = audioContext.createAnalyser();
//         const source = audioContext.createBufferSource();
//         source.buffer = decodedAudioData;
//         source.connect(analyser);
//         analyser.connect(audioContext.destination);
//         source.start();

//         const bufferLength = analyser.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);

//         const updateAudioData = () => {
//           analyser.getByteFrequencyData(dataArray);
//           setAudioData(dataArray);
//           requestAnimationFrame(updateAudioData);
//         };

//         updateAudioData();
//       };

//       fetchAudioData();
//     }
//   }, [audioSrc]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const fileReader = new FileReader();
//       fileReader.onloadend = () => {
//         setAudioSrc(fileReader.result as string);
//       };
//       fileReader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div>
//       <h1>Audio Uploader</h1>
//       <input type="file" accept="audio/*" onChange={handleFileUpload} />
//       {audioSrc && (
//         <div>
//           <h2>Uploaded Audio</h2>
//           <audio controls src={audioSrc} />
//         </div>
//       )}
//       {audioData && (
//         <Visualizer
//           audioData={audioData}  // Correct prop to use
//           width={500}
//           height={100}
//           backgroundColor="white"
//           strokeColor="blue"
//           strokeWidth={2}
//         />
//       )}
//     </div>
//   );
// };

// export default AudioUploader;
