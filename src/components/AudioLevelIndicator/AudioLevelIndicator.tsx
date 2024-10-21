import { IMicrophoneAudioTrack, IRemoteAudioTrack } from 'agora-rtc-react';
import { IMicrophoneAudioTrack as IMicrophoneAudioTrackSdk } from 'agora-rtc-sdk-ng';
import { interval } from 'd3-timer';
import React, { useEffect, useRef, useState } from 'react';
import { useVideo } from '../../contexts/VideoContext';
import MicOffIcon from '../../icons/MicOffIcon';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;

export function initializeAnalyser(stream: MediaStream) {
  const audioContext = new AudioContext(); // Create a new audioContext for each audio indicator
  const audioSource = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0.2;
  analyser.fftSize = 256;

  audioSource.connect(analyser);

  // Here we provide a way for the audioContext to be closed.
  // Closing the audioContext allows the unused audioSource to be garbage collected.
  stream.addEventListener('cleanup', () => {
    if (audioContext.state !== 'closed') {
      audioContext.close();
    }
  });

  return analyser;
}

let clipId = 0;
const getUniqueClipId = () => clipId++;

const isIOS = /iPhone|iPad/.test(navigator.userAgent);

function AudioLevelIndicator({
  audioTrack,
  color = 'white',
  slashColor = 'red',
  isLocal,
}: {
  audioTrack?:
    | IMicrophoneAudioTrack
    | IMicrophoneAudioTrackSdk
    | IRemoteAudioTrack
    | null;
  color?: string;
  slashColor?: string;
  isLocal?: boolean;
}) {
  const SVGRectRef = useRef<SVGRectElement>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  const { micOn, micPermission } = useVideo();
  const isTrackEnabled = isLocal
    ? Boolean(micOn && micPermission)
    : Boolean(audioTrack);
  const mediaStreamTrack = audioTrack?.getMediaStreamTrack();

  useEffect(() => {
    if (audioTrack && mediaStreamTrack && isTrackEnabled) {
      // Here we create a new MediaStream from a clone of the mediaStreamTrack.
      // A clone is created to allow multiple instances of this component for a single
      // AudioTrack on iOS Safari. We only clone the mediaStreamTrack on iOS.
      let newMediaStream = new MediaStream([
        isIOS ? mediaStreamTrack.clone() : mediaStreamTrack,
      ]);

      // Here we listen for the 'stopped' event on the audioTrack. When the audioTrack is stopped,
      // we stop the cloned track that is stored in 'newMediaStream'. It is important that we stop
      // all tracks when they are not in use. Browsers like Firefox don't let you create a new stream
      // from a new audio device while the active audio device still has active tracks.
      const stopAllMediaStreamTracks = () => {
        if (isIOS) {
          // If we are on iOS, then we want to stop the MediaStreamTrack that we have previously cloned.
          // If we are not on iOS, then we do not stop the MediaStreamTrack since it is the original and still in use.
          newMediaStream.getTracks().forEach((track) => track.stop());
        }
        newMediaStream.dispatchEvent(new Event('cleanup')); // Stop the audioContext
      };

      const reinitializeAnalyser = () => {
        stopAllMediaStreamTracks();
        // We only clone the mediaStreamTrack on iOS.
        newMediaStream = new MediaStream([
          isIOS ? mediaStreamTrack.clone() : mediaStreamTrack,
        ]);
        setAnalyser(initializeAnalyser(newMediaStream));
      };

      setAnalyser(initializeAnalyser(newMediaStream));

      // Here we reinitialize the AnalyserNode on focus to avoid an issue in Safari
      // where the analysers stop functioning when the user switches to a new tab
      // and switches back to the app.
      window.addEventListener('focus', reinitializeAnalyser);

      if (isLocal && micOn) {
        setTimeout(() => {
          reinitializeAnalyser();
        }, 500);
      }

      return () => {
        stopAllMediaStreamTracks();
        window.removeEventListener('focus', reinitializeAnalyser);
      };
    }
  }, [isTrackEnabled, mediaStreamTrack, audioTrack, micOn, isLocal]);

  useEffect(() => {
    const SVGClipElement = SVGRectRef.current;

    if (isTrackEnabled && SVGClipElement && analyser) {
      const sampleArray = new Uint8Array(analyser.frequencyBinCount);

      const timer = interval(() => {
        analyser.getByteFrequencyData(sampleArray);
        let values = 0;

        const length = sampleArray.length;
        for (let i = 0; i < length; i++) {
          values += sampleArray[i];
        }

        const volume = Math.min(
          14,
          Math.max(0, Math.log10(values / length / 3) * 7),
        );

        SVGClipElement?.setAttribute('y', String(14 - volume));
      }, 100);

      return () => {
        SVGClipElement.setAttribute('y', '14');
        timer.stop();
      };
    }
  }, [isTrackEnabled, analyser]);

  // Each instance of this component will need a unique HTML ID
  const clipPathId = `audio-level-clip-${getUniqueClipId()}`;

  return isTrackEnabled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      data-test-audio-indicator
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect ref={SVGRectRef} x="0" y="14" width="24" height="24" />
        </clipPath>
      </defs>
      <g fill="none" fillRule="evenodd" transform="translate(.5)">
        <rect
          clipPath={`url(#${clipPathId})`}
          width="5.2"
          height="10"
          x="9.5"
          y="3.5"
          rx="6"
          ry="3"
          fill="#23BF6E"
        ></rect>
        <path
          fill={color}
          strokeWidth="0"
          d="M17.389 10.667c.276 0 .5.224.5.5 0 3.114-2.396 5.67-5.445 5.923v2.632c0 .276-.223.5-.5.5-.245 0-.45-.177-.491-.41l-.009-.09V17.09C8.395 16.836 6 14.281 6 11.167c0-.276.224-.5.5-.5s.5.224.5.5c0 2.73 2.214 4.944 4.944 4.944 2.731 0 4.945-2.214 4.945-4.944 0-.276.224-.5.5-.5zM11.944 4c1.566 0 2.834 1.268 2.834 2.833v4.334c0 1.564-1.268 2.833-2.834 2.833-1.564 0-2.833-1.27-2.833-2.833V6.833C9.111 5.268 10.38 4 11.944 4zm0 1c-1.012 0-1.833.82-1.833 1.833v4.334c0 1.012.822 1.833 1.833 1.833 1.013 0 1.834-.82 1.834-1.833V6.833c0-1.013-.82-1.833-1.834-1.833z"
        />
      </g>
    </svg>
  ) : (
    <MicOffIcon fillColor={color} slashColor={slashColor} />
  );
}

export default React.memo(AudioLevelIndicator);
