import {
  AIDenoiserExtension,
  IAIDenoiserProcessor,
} from 'agora-extension-ai-denoiser';
import AgoraRTC, { IMicrophoneAudioTrack } from 'agora-rtc-react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { NOISE_CANCELLATION_KEY } from '../../constants';

export default function useAINoiseCancellation(
  localMicrophoneTrack: IMicrophoneAudioTrack | null,
  isAINoiseEnabled: boolean,
  setIsAINoiseEnabled: Dispatch<SetStateAction<boolean | undefined>>,
) {
  const processor = useRef<IAIDenoiserProcessor>();

  const extension = useRef(
    new AIDenoiserExtension({
      assetsPath: '/external',
    }),
  );
  const handleOverLoad = async () => {
    await processor.current?.disable();
    setIsAINoiseEnabled(false);
    localStorage.setItem(NOISE_CANCELLATION_KEY, 'false');
  };

  processor.current?.on('overload', handleOverLoad);

  useEffect(() => {
    if (!localMicrophoneTrack) return;
    const initializeAIDenoiserProcessor = async () => {
      try {
        AgoraRTC.registerExtensions([extension.current]);
        if (!extension.current.checkCompatibility()) {
          console.error('Does not support AI Denoiser!');
          return;
        }
        processor.current = extension.current.createProcessor();
        localMicrophoneTrack
          .pipe(processor.current)
          .pipe(localMicrophoneTrack.processorDestination);
        await processor.current.enable();
      } catch (error) {
        console.error('Error enabling AI noise cancellation:', error);
      }
    };

    const disableAIDenoiser = async () => {
      try {
        if (processor.current) {
          processor.current?.unpipe();
          await processor.current.disable();
        }
      } catch (error) {
        console.error('Error disabling AI noise cancellation:', error);
      }
    };

    if (!processor.current?.enabled && isAINoiseEnabled) {
      initializeAIDenoiserProcessor();
    } else {
      disableAIDenoiser();
    }

    return () => {
      disableAIDenoiser();
    };
  }, [isAINoiseEnabled, localMicrophoneTrack]);

  return { processor };
}
