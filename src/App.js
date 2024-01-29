import React, { useEffect, useState } from 'react';
import Weather from './Components/Weather.jsx';
import axios from 'axios';
import './App.css';
import cloudImage from './cloud.png';
import cloud1Image from './cloud.png';

function App() {
  const [backgroundImage, setBackgroundImage] = useState(cloudImage);

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Check if the current time is between 6:00 a.m. and 5:00 p.m.
      const isDaytime = hours >= 6 && hours < 18;

      // Set the background image based on the time of day
      setBackgroundImage(isDaytime ? cloudImage : cloud1Image);
    };

    getCurrentTime();
  }, []); // Run this effect only once on mount

  return (
    <div className="bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-8 text-white">Weather Forecast App</h1>
        <Weather />
      </div>
    </div>

  );
}

export default App;
