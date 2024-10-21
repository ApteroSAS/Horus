import { IAgoraRTCRemoteUser, useRemoteUsers } from 'agora-rtc-react';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import { useAppState } from '../../contexts/AppStateContext';
import { useEffect, useState } from 'react';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';

//  If a participant that is not currently on the first page becomes
//  the dominant speaker, we move them to the first page where the least
//  recent dominant speaker was located. We are able to order the
//  participants appropriately by keeping track of the timestamp from when
//  they became the newest dominant speaker.

interface OrderedParticipant {
  participant: IAgoraRTCRemoteUser;
  dominantSpeakerStartTime: number;
}

/*
 * Uncomment all the commented line below and modify for implement
 * auto rearrange participants based on dominant speaker
 */
export default function useGalleryViewParticipants(
  isMobileGalleryViewActive = false,
) {
  const dominantSpeaker = useDominantSpeaker(true);

  const { maxGalleryViewParticipants } = useAppState();

  const remoteUsers = useRemoteUsers();

  const [orderParticipants, setOrderParticipants] = useState<
    OrderedParticipant[]
  >([]);

  useEffect(() => {
    setOrderParticipants((preParticipants) => {
      const preParticipantsUid = preParticipants.map((p) => p.participant.uid);

      // Create a map to store the index of each UID in the first array
      const indexMap = new Map(
        preParticipantsUid.map((uid, index) => [uid, index]),
      );

      const participants = remoteUsers.filter(
        (user) => !user.uid.toString().includes(SHARE_SCREEN_NAME_SUFFIX),
      );

      // Sort the second array based on the order in the first array
      participants.sort((a, b) => {
        // If the UID exists in the first array, use its index; otherwise, move it to the end
        const indexA = indexMap.has(a.uid)
          ? (indexMap.get(a.uid) as number)
          : Infinity;
        const indexB = indexMap.has(b.uid)
          ? (indexMap.get(b.uid) as number)
          : Infinity;

        return indexA - indexB;
      });

      return participants.map((user) => ({
        participant: user,
        dominantSpeakerStartTime:
          preParticipants.find((p) => p.participant.uid === user.uid)
            ?.dominantSpeakerStartTime || 0,
      }));
    });
  }, [remoteUsers]);

  useEffect(() => {
    if (dominantSpeaker !== null) {
      setOrderParticipants((prevParticipants) => {
        const newParticipantsArray = prevParticipants.slice();
        const newDominantSpeaker = newParticipantsArray.find(
          (p) => p.participant.uid === dominantSpeaker,
        );

        // it's possible that the dominantSpeaker is removed from the newParticipantsArray before they become null:
        if (newDominantSpeaker)
          // update the participant's dominantSpeakerStartTime to when they became the new dominant speaker:
          newDominantSpeaker.dominantSpeakerStartTime = Date.now();
        else return prevParticipants;

        // Here we use maxGalleryViewParticipants - 1 since the localParticipant will always be the first in the gallery
        const maxFirstPageParticipants = isMobileGalleryViewActive
          ? 5
          : maxGalleryViewParticipants - 1;
        const firstPageParticipants = newParticipantsArray.slice(
          0,
          maxFirstPageParticipants,
        );

        // if the newest dominant speaker is not currently on the first page, reorder the orderedParticipants array:
        if (
          !firstPageParticipants.some(
            (p) => p.participant.uid === dominantSpeaker,
          )
        ) {
          // find the least recent dominant speaker by sorting the first page participants by their dominantSpeakerStartTime:
          const sortedFirstPageParticipants = firstPageParticipants.sort(
            (a, b) => a.dominantSpeakerStartTime - b.dominantSpeakerStartTime,
          );
          const leastRecentDominantSpeaker = sortedFirstPageParticipants[0];

          /** Reorder the first page participants */
          // Temporarily remove the newest dominant speaker:
          newParticipantsArray.splice(
            newParticipantsArray.indexOf(newDominantSpeaker),
            1,
          );

          // Remove the least recent dominant speaker and replace them with the newest:
          newParticipantsArray.splice(
            newParticipantsArray.indexOf(leastRecentDominantSpeaker),
            1,
            newDominantSpeaker,
          );

          // Add the least recent dominant speaker back into the array after the last participant on the first page.
          newParticipantsArray.splice(
            maxFirstPageParticipants,
            0,
            leastRecentDominantSpeaker,
          );
        }
        return newParticipantsArray;
      });
    }
  }, [dominantSpeaker, maxGalleryViewParticipants, isMobileGalleryViewActive]);

  return orderParticipants.map((p) => p.participant);
}
