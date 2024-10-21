import { useState, useEffect } from 'react';
import { useAppState } from '../../../contexts/AppStateContext';
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-react';

export type GalleryViewParticipant = IAgoraRTCRemoteUser | IAgoraRTCClient;

export function usePagination(participants: GalleryViewParticipant[]) {
  const [currentPage, setCurrentPage] = useState(1); // Pages are 1 indexed
  const { maxGalleryViewParticipants } = useAppState();

  const totalPages = Math.ceil(
    participants.length / maxGalleryViewParticipants,
  );
  const isBeyondLastPage = currentPage > totalPages;

  useEffect(() => {
    if (isBeyondLastPage) {
      setCurrentPage(totalPages);
    }
  }, [isBeyondLastPage, totalPages]);

  const paginatedParticipants = participants.slice(
    (currentPage - 1) * maxGalleryViewParticipants,
    currentPage * maxGalleryViewParticipants,
  );

  return { paginatedParticipants, setCurrentPage, currentPage, totalPages };
}
