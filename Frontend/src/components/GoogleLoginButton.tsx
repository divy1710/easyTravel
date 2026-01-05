import { useEffect } from 'react';

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
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
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);

      setTimeout(() => clearInterval(checkGoogle), 5000);
    };

    const initializeGoogleSignIn = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      const buttonDiv = document.getElementById('google-signin-button');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'filled_blue',
          size: 'large',
          text: text,
          width: buttonDiv.offsetWidth,
          logo_alignment: 'left',
        });
      }
    };

    const handleCredentialResponse = (response: any) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else {
        onError();
      }
    };

    loadGoogleScript();
  }, [onSuccess, onError, text]);

  return (
    <div 
      id="google-signin-button" 
      className="w-full flex justify-center"
    />
  );
}
