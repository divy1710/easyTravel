import React, { useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}
// used text options as per Google Identity Services documentation

// Extend window to include google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton({ 
  onSuccess, 
  onError,
  text = 'continue_with'
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Check if Google script is loaded
    if (!window.google || !buttonRef.current) {
      console.warn('Google Identity Services not loaded yet');
      return;
    }

    if (!googleClientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is not configured');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: any) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.();
          }
        },
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: 'filled_blue',
          size: 'large',
          text: text,
          shape: 'rectangular',
          width: buttonRef.current.offsetWidth,
        }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      onError?.();
    }
  }, [googleClientId, onSuccess, onError, text]);

  return (
    <div 
      ref={buttonRef} 
      className="w-full"
      style={{ minHeight: '44px' }}
    />
  );
}
