
import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="m-6 md:m-10 p-4 bg-[#FFEBEE] border-2 border-[#C62828] text-[#C62828] rounded-lg flex items-center">
      <AlertTriangleIcon />
      <span className="ml-3 text-lg">{message}</span>
    </div>
  );
};