import React from 'react';
import { useSelector } from 'react-redux';

const Loader = () => {
  const loading = useSelector(state => state.loading);

  if (!loading) {
    return null
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <img src="/loader.gif" alt="loader" />
    </div>
  );
};

export default Loader;
