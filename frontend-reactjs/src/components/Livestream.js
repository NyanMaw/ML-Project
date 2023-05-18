import React, { useEffect, useRef, useState } from 'react';
import '../css/Livestream.css';

const Livestream = ({ url }) => {
  // Refs for video, canvas, and WebSocket connection
  const rawVideoRef = useRef(null);
  const processedVideoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const socketRef = useRef(null);

  // State variables for video devices, selected device, and camera activation
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [camerasActive, setCamerasActive] = useState(true);

  // Fetch and set video devices when component mounts or selected device changes
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setVideoDevices(videoDevices);
        const desiredDevice = selectedDevice || videoDevices[0];
        if (desiredDevice) {
          return navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: desiredDevice.deviceId } } });
        } else {
          throw new Error('No cameras found.');
        }
      })
      .then((stream) => {
        if (camerasActive) {
          rawVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error(err));
  }, [selectedDevice, camerasActive]);

  // Setup WebSocket connection and handle video frame streaming
  useEffect(() => {
    const rawVideo = rawVideoRef.current;
    const processedVideo = processedVideoRef.current;
    const canvas = canvasRef.current;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (camerasActive) {
            rawVideo.srcObject = stream;
          }

          rawVideo.onloadedmetadata = () => {
            canvas.width = rawVideo.videoWidth;
            canvas.height = rawVideo.videoHeight;
          };
        })
        .catch((error) => {
          console.error('Something went wrong while accessing the webcam!', error);
        });
    }

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('[open] Connection established');
      console.log('Sending video frames to server...');

      const sendFrame = () => {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          if (rawVideo.readyState === rawVideo.HAVE_ENOUGH_DATA) {
            canvas.getContext('2d').drawImage(rawVideo, 0, 0, canvas.width, canvas.height);
            const frame = canvas.toDataURL('image/jpeg');
            socketRef.current.send(JSON.stringify({ image: frame }));
          }
        } else if (socketRef.current.readyState === WebSocket.CONNECTING) {
          // Handle connecting state, such as displaying a message or waiting
          console.log('WebSocket is still connecting...');
        } else {
          // Handle other states, such as closing or closed
          console.log('WebSocket is not open.');
        }

        if (camerasActive) {
          requestAnimationFrame(sendFrame);
        }
      };

      requestAnimationFrame(sendFrame);
    };

    socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const processedFrame = data.image;
        let base64Data = data.image.substring(data.image.indexOf(',') + 1);
        //base64Data = base64Data.substring('/9j/'.length);
        // Convert the base64 image data to a Blob
        const blob = b64toBlob(base64Data, 'image/jpeg');
        const blobUrl = URL.createObjectURL(blob);
        //console.log(processedVideoRef.current)
        // Update the processed video element with the Blob URL
        processedVideoRef.current.src = blobUrl;
        processedVideoRef.current.addEventListener('loadeddata', () => {
            processedVideoRef.current.play();
        });
      };

    // Helper function to convert base64 to Blob
    function b64toBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    }

    socketRef.current.onclose = (event) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log('[close] Connection died');
      }
    };

    // Cleanup function to stop video capture and close WebSocket connection
    return () => {
      if (rawVideo.srcObject) {
        rawVideo.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, camerasActive]);

  // Toggle camera activation and handle selected device changes
  const handleCameraToggle = () => {
    if (camerasActive) {
      const stream = rawVideoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    } else {
      if (selectedDevice) {
        navigator.mediaDevices
          .getUserMedia({ video: { deviceId: { exact: selectedDevice.deviceId } } })
          .then((stream) => {
            rawVideoRef.current.srcObject = stream;
          })
          .catch((error) => {
            console.error('Error accessing camera:', error);
          });
      } else {
        console.error('No camera selected.');
      }
    }
    setCamerasActive((prevState) => !prevState);
  };

  return (
    <div>
      <div>
        {/* Render buttons for each video device */}
        {videoDevices.map((device, index) => (
          <button key={device.deviceId} onClick={() => setSelectedDevice(device)}>
            Use Camera {index + 1}
          </button>
        ))}
        {/* Button to toggle camera activation */}
        <button onClick={handleCameraToggle}>
          {camerasActive ? 'Turn Off Cameras' : 'Turn On Cameras'}
        </button>
      </div>
      {/* Render video elements */}
      <div>
        <h3>Raw Footage</h3>
        <video ref={rawVideoRef} autoPlay playsInline/>
      </div>
      <div>
        <h3>Processed Footage</h3>
        <img ref={processedVideoRef} autoPlay playsInline/>
      </div>
    </div>
  );
};

export default Livestream;