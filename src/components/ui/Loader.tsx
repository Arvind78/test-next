import React from 'react';
import { HashLoader } from 'react-spinners';

const Loader = ({ size = 36, color = 'white', loading = true }) => {
  return (
    <div className="flex justify-center items-center">
      <HashLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Loader;
