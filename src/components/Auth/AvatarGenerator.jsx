'use client'
import React, { useEffect, useState } from 'react';


const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B9B9B', '#E9967A'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const AvatarGenerator = ({ name = '', size = 120 }) => {
  const [initials, setInitials] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    // Generate initials from name or use first character of email
    const generateInitials = () => {
      if (!name) return '?';
      
      const parts = name.trim().split(' ');
      if (parts.length === 1) {
        return name.charAt(0).toUpperCase();
      }
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    setInitials(generateInitials());
    setBackgroundColor(generateRandomColor());
  }, [name]);

  return (
    <div className="flex justify-center">
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: backgroundColor,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size / 2.5,
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onClick={() => setBackgroundColor(generateRandomColor())}
        className="hover:transform hover:scale-105 shadow-lg"
      >
        {initials}
      </div>
    </div>
  );
};


export default AvatarGenerator;