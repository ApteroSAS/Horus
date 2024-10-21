import { UID, useRTCClient } from 'agora-rtc-react';
import { useEffect, useState } from 'react';
import { MINIMUM_VOLUME_LEVEL } from '../../constants';

export default function useDominantSpeaker(includeNull = false) {
  const [dominantSpeaker, setDominantSpeaker] = useState<null | UID>(null);

  const client = useRTCClient();

  useEffect(() => {
    if (client) {
      client.enableAudioVolumeIndicator();
      const handleVolumeIndicator = (
        volumes: { level: number; uid: UID }[],
      ) => {
        // Determine the highest volume level
        let maxVolume = MINIMUM_VOLUME_LEVEL;
        let speakerUID = null;

        volumes.forEach((volume) => {
          // Local user isn't determined as dominant speaker
          if (
            volume.level > MINIMUM_VOLUME_LEVEL &&
            volume.level > maxVolume &&
            volume.uid !== client.uid
          ) {
            maxVolume = volume.level;
            speakerUID = volume.uid;
          }
        });

        // Update dominant speaker state if needed
        if (includeNull || speakerUID !== null) {
          setDominantSpeaker(speakerUID);
        }
      };

      client.on('volume-indicator', handleVolumeIndicator);

      return () => {
        client.off('volume-indicator', handleVolumeIndicator);
      };
    }
  }, [client, includeNull]);

  return dominantSpeaker;
}
