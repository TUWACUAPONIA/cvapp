'use client';

import { useState, useEffect } from 'react';

interface OCRStatusProps {
  isProcessing: boolean;
  progress?: number;
  message?: string;
}

export default function OCRStatus({ isProcessing, progress = 0, message }: OCRStatusProps) {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Procesamiento con OCR en progreso</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {message || 'El documento está siendo procesado con reconocimiento óptico de caracteres'}
              <span className="inline-block w-6">{dots}</span>
            </p>
          </div>
          {progress > 0 && (
            <div className="mt-3">
              <div className="relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-yellow-200">
                  <div 
                    style={{ width: `${progress}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
              <div className="text-xs text-yellow-700 mt-1 text-right">{progress}%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}