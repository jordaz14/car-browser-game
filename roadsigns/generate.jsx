import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

const cities = ['Albuquerque', 'Los Angeles', 'New York City', 'Jersey City', 'El Paso', 'Dallas'];

const TrafficSign = () => {
  const [city, setCity] = useState('');
  const [interstate, setInterstate] = useState('');

  useEffect(() => {
    const changeSign = () => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomInterstate = Math.floor(Math.random() * 100) + 1;
      setCity(randomCity);
      setInterstate(randomInterstate);
    };

    changeSign();
    const interval = setInterval(changeSign, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-700 text-white p-4 rounded-lg shadow-lg max-w-sm mx-auto">
      <div className="border-2 border-white p-2 mb-2 text-center">
        <div className="text-2xl font-bold">EXIT 211 A</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white text-black font-bold text-xl p-2 rounded-full w-12 h-12 flex items-center justify-center mr-2">
            {interstate}
          </div>
          <div className="text-3xl font-bold">{city}</div>
        </div>
        <ArrowUpRight size={32} />
      </div>
    </div>
  );
};

export default TrafficSign;