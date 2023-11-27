import { MutableRefObject, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

import { UseQrReaderHook } from '../types';

import { isMediaDevicesSupported, isValidType } from './utils';

// TODO: add support for debug logs
export const useQrReader: UseQrReaderHook = ({
  scanDelay: delayBetweenScanAttempts,
  constraints: video,
  onResult,
  videoId,
}) => {
  const controlsRef: any = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onResult(null, new Error(message), codeReader);
    }

    if (isValidType(video, 'constraints', 'object')) {
      codeReader
        .decodeFromConstraints({ video }, videoId, (result, error) => {
          if (isValidType(onResult, 'onResult', 'function')) {
            onResult(result, error, codeReader);
          }
        })
        .then((controls) => (controlsRef.current = controls))
        .catch((error: Error) => {
          if (isValidType(onResult, 'onResult', 'function')) {
            onResult(null, error, codeReader);
          }
        });
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, []);
};
