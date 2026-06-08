import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ResponsiveLayout from './layouts/ResponsiveLayout';

export default function App() {
  return (
    <Routes>
      {/* Route all paths to ResponsiveLayout which handles layout switching */}
      <Route path="/*" element={<ResponsiveLayout />} />
    </Routes>
  );
}
