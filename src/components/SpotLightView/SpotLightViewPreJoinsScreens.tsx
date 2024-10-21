import { useTranslation } from 'react-i18next';
import IntroContainer from '../IntroContainer/IntroContainer';
import SpotLightViewDeviceSelection from './SpotLightViewDeviceSelection';

export default function SpotLightViewPreJoinsScreens() {
  const { t } = useTranslation('common');
  return (
    <IntroContainer>
      <SpotLightViewDeviceSelection
        name={
          `${t('viewer_screen')} ` + Math.random().toString(36).substring(2, 7)
        }
      />
    </IntroContainer>
  );
}
