export const BACKGROUND_FILTER_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] =
  {
    width: 640,
    height: 480,
    frameRate: 24,
  };

export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'AgoraVideoApp-selectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'AgoraVideoApp-selectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'AgoraVideoApp-selectedVideoInput';

export const VIDEO_INPUT_MUTED_KEY = 'AgoraVideoApp-VideoInput-muted';
export const AUDIO_INPUT_MUTED_KEY = 'AgoraVideoApp-AudioInput-muted';
export const PREVIOUSLY_JOINED_KEY = 'AgoraVideoApp-previouslyJoined';
export const USER_NAME_KEY = 'AgoraVideoApp-userName';
export const NOISE_CANCELLATION_KEY = 'AgoraVideoApp-noiseCancellation';

// This is used to store the current background settings in localStorage
export const SELECTED_BACKGROUND_SETTINGS_KEY =
  'AgoraVideoApp-selectedBackgroundSettings';

export const GALLERY_VIEW_ASPECT_RATIO = 9 / 16; // 16:9
export const GALLERY_VIEW_MARGIN = 3;

// Read API doc for more information about volume indicator
// https://api-ref.agora.io/en/video-sdk/web/4.x/interfaces/iagorartcclient.html#event_volume_indicator
export const MINIMUM_VOLUME_LEVEL = 40;

export const USER_NAME_MAX_LENGTH = 60;
export const MAX_GALLERY_PARTICIPANTS = 'max-gallery-participants-key';

export const SHARE_SCREEN_NAME_SUFFIX = '_screen';

export const MAX_USERS_CAMERA_ON = 15;
