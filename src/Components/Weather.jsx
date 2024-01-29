// src/components/Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import magnifyingGlassImage from './magnify.png';
import daytimeBackgroundImage from './sc.png';
import nighttimeBackgroundImage from './mc.png';
import image1 from './rain.png';
import image2 from './cl.png';
import image3 from './sun.png';



const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true to show loading state initially
  const [showWeather, setShowWeather] = useState(false);

  useEffect(() => {
    // Function to get weather data based on user's geolocation
    const fetchWeatherByGeolocation = async (latitude, longitude) => {
      const apiKey = 'a8b18b72563e31295181befa18a05e9d';
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setWeatherData(response.data);
        setShowWeather(true);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Function to get user's geolocation
    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByGeolocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLoading(false);
        }
      );
    };

    // Check if geolocation is supported
    if ('geolocation' in navigator) {
      getUserLocation();
    } else {
      console.error('Geolocation is not supported');
      setLoading(false);
    }
  }, []);

  const fetchData = async (location) => {
    const apiKey = 'a8b18b72563e31295181befa18a05e9d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    try {
      setLoading(true);
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
      setShowWeather(true);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setShowWeather(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(city);
  };
  const getValidPrecipitationPercentage = (precipitationCode) => {
    // Check if precipitationCode is a valid number
    if (!isNaN(parseFloat(precipitationCode)) && isFinite(precipitationCode)) {
      // Cap the precipitation percentage at 100%
      const percentage = Math.round(precipitationCode * 100);
      return percentage > 100 ? '100' : `${percentage}`;
    }
    // If not a valid number, return '0%'
    return '0%';
  };

  const getPrecipitationImage = (percentage) => {
    if (percentage > 50) {
      return image1;
    } else if (percentage > 0) {
      return image2;
    } else {
      return image3;
    }
  };

  const getPrecipitationPercentage = (precipitationCode) => {
    return Math.round(precipitationCode * 100);
  };

  const calculateAverageTemperature = (hourlyData) => {
    const totalTemperature = hourlyData.reduce((sum, data) => sum + data.main.temp, 0);
    const averageTemperature = totalTemperature / hourlyData.length;
    return Math.round(averageTemperature);
  };

  const currentWeather = weatherData?.list[0];

  // Function to get temperature at a specific time
  const getTemperatureAtSpecificTime = (time) => {
    const specificTimeData = weatherData?.list.find(
      (item) =>
        new Date(item.dt * 1000).getHours() === time.getHours() &&
        new Date(item.dt * 1000).getMinutes() === time.getMinutes()
    );

    return specificTimeData?.main?.temp ?? 0;
  };

  // Determine the current temperature using the same policy
  const currentMaxTemperature = getTemperatureAtSpecificTime(new Date(0, 0, 0, 14, 30, 0)); // 2:30 pm
  const currentMinTemperature = getTemperatureAtSpecificTime(new Date(0, 0, 0, 5, 30, 0)); // 5:30 am


  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 relative">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={handleCityChange}
              placeholder="Enter City Name"
              className="mt-1 p-2 border-b-2 border-blue-500 w-full focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              disabled={loading}
            >
              <img src={magnifyingGlassImage} alt="Search" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </form>





      {showWeather && weatherData ? (
        <div>
          {/* Display current weather data */}
          <h2 className="text-5xl font-bold mb-4 text-white" >{weatherData.city.name}</h2>
          <div className="p-6">
            <div className="bg-blue-900 bg-opacity-70 text-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Current Weather</h2>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="parameter-box bg-blue-500 bg-opacity-70 text-white pt-6 pb-6 pl-14 pr-12 rounded-lg shadow-lg md:w-1/2 xl:w-1/4">
                  <p className="font-bold text-lg">Temperature</p>
                  <p>{Math.round(weatherData.list[0].main.temp)}°C</p>
                </div>

                <div className="parameter-box bg-blue-500 bg-opacity-70 text-white pt-6 pb-6 pl-2 pr-2 rounded-lg shadow-lg md:w-1/2 xl:w-1/4">
                  <p className="font-bold text-lg">Max Temperature Today</p>
                  <p>{Math.round(currentMaxTemperature) + 1}°C</p>
                </div>

                <div className="parameter-box bg-blue-500 bg-opacity-70 text-white pt-6 pb-6 pl-2 pr-2 rounded-lg shadow-lg md:w-1/2 xl:w-1/4">
                  <p className="font-bold text-lg">Min Temperature Today</p>
                  <p>{Math.round(currentMinTemperature) - 1}°C</p>
                </div>

                <div className="parameter-box bg-blue-500 bg-opacity-70 text-white pt-6 pb-6 pl-16 pr-14 rounded-lg shadow-lg md:w-1/2 xl:w-1/4">
                  <p className="font-bold text-lg">Feels Like</p>
                  <p>{Math.round(weatherData.list[0].main.feels_like)}°C</p>
                </div>

                <div className="parameter-box bg-blue-500 bg-opacity-70 text-white pt-6 pb-6 pl-16 pr-16 rounded-lg shadow-lg md:w-1/2 xl:w-1/4">
                  <p className="font-bold text-lg">Humidity</p>
                  <p>{Math.round(weatherData.list[0].main.humidity) + 4}%</p>
                </div>

                <div className="parameter-box bg-blue-500 bg-opacity-70 text-white pt-6 pb-6 pl-12 pr-12 rounded-lg shadow-lg md:w-1/2 xl:w-1/4">
                  <p className="font-bold text-lg">Precipitation</p>
                  <p>
                    {weatherData.list[0].rain !== undefined
                      ? getValidPrecipitationPercentage(weatherData.list[0].rain['1h'])
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>







            <h2 className="text-4xl font-extrabold mb-4 mt-[140px]" style={{ color: '#8B8000' }}>Hourly Forecast</h2>
            <div className="pr-[25px] pl-[25px] pb-[30px] pt-[30px] ml-[-20px] mr-[-16px] flex flex-wrap justify-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 lg:space-x-12">
              {weatherData.list.slice(0, 5).map((hourData, index) => {
                const hour = new Date(hourData.dt * 1000).getHours();
                const isDaytime = hour >= 5 && hour < 18;

                const backgroundImageStyle = {
                  backgroundImage: `url(${isDaytime ? daytimeBackgroundImage : nighttimeBackgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '150px', // Adjust the height as needed
                };

                const backgroundColorStyle = {
                  backgroundColor: isDaytime ? 'rgba(0, 31, 63, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                };

                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 bg-gradient-to-b shadow-lg shadow-blue-500/50 from-blue-500 to-blue-700 p-6 rounded-lg text-white"
                    style={{ ...backgroundImageStyle, ...backgroundColorStyle }}
                  >
                    <p className="text-xl font-semibold">
                      {new Date(hourData.dt * 1000).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                    <p className="text-lg">Temperature: {Math.round(hourData.main.temp)}°C</p>
                    {/* Display precipitation information for each hour */}
                    <p className="text-lg">
                      Precipitation: {hourData.rain ? `${getPrecipitationPercentage(hourData.rain['3h'])}%` : '0%'}
                    </p>
                    {/* Add more hourly information as needed */}
                  </div>
                );
              })}
            </div>;





            {/* Display daily forecast for the next 7 days */}
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#00008B' }} >Daily Forecast</h2>
            <div className="pr-[25px] pl-[25px] pb-[30px] pt-[30px] ml-[60px] flex flex-wrap justify-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 lg:space-x-12">
              {weatherData.list.filter((data) => data.dt_txt.includes('12:00:00')).map((dayData, index) => {
                const currentDate = new Date(dayData.dt * 1000);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const next5Days = new Date();
                next5Days.setDate(tomorrow.getDate() + 5);

                // Check if the current date is within the range of tomorrow to the next 5 days
                if (currentDate >= tomorrow && currentDate <= next5Days) {
                  const consecutive5_30_AM_data = weatherData.list.filter(
                    (item) => new Date(item.dt * 1000).getHours() === 5 && new Date(item.dt * 1000).getMinutes() === 30
                  );

                  // Get the specific 5:30 am temperature for the current day
                  const specific5_30_AM_data = consecutive5_30_AM_data.find(
                    (item) => new Date(item.dt * 1000).getDate() === currentDate.getDate()
                  );

                  // Find consecutive 2:30 pm data for each day
                  const consecutive2_30_PM_data = weatherData.list.filter(
                    (item) => new Date(item.dt * 1000).getHours() === 14 && new Date(item.dt * 1000).getMinutes() === 30
                  );

                  // Get the specific 2:30 pm temperature for the current day
                  const specific2_30_PM_data = consecutive2_30_PM_data.find(
                    (item) => new Date(item.dt * 1000).getDate() === currentDate.getDate()
                  );

                  // Get precipitation percentage
                  const precipitationPercentage = dayData.rain !== undefined
                    ? getValidPrecipitationPercentage(dayData.rain['3h'])
                    : 0;

                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 ml-[-50px] w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-blue-900 bg-opacity-70 shadow-lg p-6 rounded-lg text-white mb-4`}
                      style={{
                        backgroundImage: `url(${getPrecipitationImage(precipitationPercentage)})`,
                        backgroundSize: 'contain',  // or 'cover' based on your preference
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',  // Center the image horizontally
                        height: '150px',  // Default height
                        width: '220px'
                      }}
                    >
                      <p className="font-bold text-lg">
                        {currentDate.toLocaleDateString([], { weekday: 'short' })}
                      </p>
                      <p>Max Temperature: {Math.round(specific2_30_PM_data?.main?.temp ?? 0) + 1}°C</p>
                      <p>
                        Min Temperature: {Math.round(specific5_30_AM_data?.main?.temp ?? 0) - 1}°C
                      </p>
                      <p>
                        Precipitation: {precipitationPercentage}%
                      </p>
                    </div>
                  );
                }

                return null; // Exclude days before tomorrow and beyond the next 5 days
              })}
            </div>
















            {/* Add more information as needed */}
          </div>
        </div>
      ) : (
        loading && <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Weather;
