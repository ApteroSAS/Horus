import { FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MAX_GALLERY_PARTICIPANTS } from '../../../constants';
import { useAppState } from '../../../contexts/AppStateContext';

const MAX_PARTICIPANT_OPTIONS = [6, 12, 24];

export default function MaxGalleryViewParticipants() {
  const { maxGalleryViewParticipants, setMaxGalleryViewParticipants } =
    useAppState();

  const { t } = useTranslation('common');

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        {t('max_gallery_view_participants')}
      </Typography>
      <Grid container alignItems="center" justifyContent="space-between">
        <div className="inputSelect">
          <FormControl fullWidth>
            <Select
              variant="outlined"
              sx={{ p: 0 }}
              value={maxGalleryViewParticipants}
              onChange={(e) => {
                setMaxGalleryViewParticipants(Number(e.target.value));
                window.localStorage.setItem(
                  MAX_GALLERY_PARTICIPANTS,
                  e.target.value as string,
                );
              }}
            >
              {MAX_PARTICIPANT_OPTIONS.map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Grid>
    </div>
  );
}
