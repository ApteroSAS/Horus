import { IAgoraRTCRemoteUser, useRemoteUsers } from 'agora-rtc-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';

type selectedParticipantContextType = [
  IAgoraRTCRemoteUser | null,
  (participant: IAgoraRTCRemoteUser | null) => void,
];

export const selectedParticipantContext =
  createContext<selectedParticipantContextType>([null, () => {}]);

export default function useSelectedParticipant() {
  const [selectedParticipant, setSelectedParticipant] = useContext(
    selectedParticipantContext,
  );
  return [selectedParticipant, setSelectedParticipant] as const;
}

type SelectedParticipantProviderProps = {
  children: React.ReactNode;
};

export function SelectedParticipantProvider({
  children,
}: SelectedParticipantProviderProps) {
  const { isGalleryViewActive } = useAppState();
  const remoteUsers = useRemoteUsers();
  const [selectedParticipant, _setSelectedParticipant] =
    useState<IAgoraRTCRemoteUser | null>(null);
  const setSelectedParticipant = (participant: IAgoraRTCRemoteUser | null) =>
    _setSelectedParticipant((prevParticipant) =>
      prevParticipant === participant ? null : participant,
    );

  useEffect(() => {
    const hasSelectedParticipant = remoteUsers.find(
      (user) => user.uid === selectedParticipant?.uid,
    );
    const shareScreenParticipant = remoteUsers.find((user) =>
      user.uid.toString().includes(SHARE_SCREEN_NAME_SUFFIX),
    );

    if (
      isGalleryViewActive ||
      !hasSelectedParticipant ||
      (shareScreenParticipant &&
        shareScreenParticipant.uid ===
          `${selectedParticipant?.uid}${SHARE_SCREEN_NAME_SUFFIX}`)
    ) {
      _setSelectedParticipant(null);
    }
  }, [isGalleryViewActive, remoteUsers, selectedParticipant]);

  return (
    <selectedParticipantContext.Provider
      value={[selectedParticipant, setSelectedParticipant]}
    >
      {children}
    </selectedParticipantContext.Provider>
  );
}
