import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState(undefined);
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convert2Gif = async () => {
    alert("Processing your request to convert this video file to a GIF.");
    
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const gifURL = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(gifURL);
  };

  return ready ? (
    <div
      className="App"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {video && (
        <video
          style={{ marginTop: '20px' }}
          controls
          width="350"
          src={URL.createObjectURL(video)}
        ></video>
      )}
      <input
        style={{ marginTop: '30px', marginLeft: '10px' }}
        type="file"
        onChange={(e) => setVideo(e.target.files?.item(0))}
      />
      {video && <div>
        <h3>Result</h3>
      <button onClick={convert2Gif}>Convert to GIF</button>
      </div>
      }
      

      {gif && (
        <img style={{ marginTop: '20px' }} controls width="350" src={gif} />
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
