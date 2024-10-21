import AgoraRTC, { ICameraVideoTrack } from 'agora-rtc-react';
import { Thumbnail } from '../../components/BackgroundSelectionDialog/BackgroundThumbnail/BackgroundThumbnail';
import { SELECTED_BACKGROUND_SETTINGS_KEY } from '../../constants';
import Abstract from '../../images/Abstract.jpg';
import BohoHome from '../../images/BohoHome.jpg';
import Bookshelf from '../../images/Bookshelf.jpg';
import CoffeeShop from '../../images/CoffeeShop.jpg';
import Contemporary from '../../images/Contemporary.jpg';
import CozyHome from '../../images/CozyHome.jpg';
import {
  default as Desert,
  default as DesertThumb,
} from '../../images/Desert.jpg';
import Fishing from '../../images/Fishing.jpg';
import Flower from '../../images/Flower.jpg';
import Kitchen from '../../images/Kitchen.jpg';
import ModernHome from '../../images/ModernHome.jpg';
import Nature from '../../images/Nature.jpg';
import Ocean from '../../images/Ocean.jpg';
import Patio from '../../images/Patio.jpg';
import Plant from '../../images/Plant.jpg';
import SanFrancisco from '../../images/SanFrancisco.jpg';
import AbstractThumb from '../../images/thumb/Abstract.jpg';
import BohoHomeThumb from '../../images/thumb/BohoHome.jpg';
import BookshelfThumb from '../../images/thumb/Bookshelf.jpg';
import CoffeeShopThumb from '../../images/thumb/CoffeeShop.jpg';
import ContemporaryThumb from '../../images/thumb/Contemporary.jpg';
import CozyHomeThumb from '../../images/thumb/CozyHome.jpg';
import FishingThumb from '../../images/thumb/Fishing.jpg';
import FlowerThumb from '../../images/thumb/Flower.jpg';
import KitchenThumb from '../../images/thumb/Kitchen.jpg';
import ModernHomeThumb from '../../images/thumb/ModernHome.jpg';
import NatureThumb from '../../images/thumb/Nature.jpg';
import OceanThumb from '../../images/thumb/Ocean.jpg';
import PatioThumb from '../../images/thumb/Patio.jpg';
import PlantThumb from '../../images/thumb/Plant.jpg';
import SanFranciscoThumb from '../../images/thumb/SanFrancisco.jpg';
import { useLocalStorageState } from '../useLocalStorageState/useLocalStorageState';
import VirtualBackgroundExtension from 'agora-extension-virtual-background';
import { useEffect, useRef } from 'react';
import { IVirtualBackgroundProcessor } from 'agora-extension-virtual-background';
import { BackgroundType } from '../../enum';

export interface BackgroundSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = [
  'Abstract',
  'Boho Home',
  'Bookshelf',
  'Coffee Shop',
  'Contemporary',
  'Cozy Home',
  'Desert',
  'Fishing',
  'Flower',
  'Kitchen',
  'Modern Home',
  'Nature',
  'Ocean',
  'Patio',
  'Plant',
  'San Francisco',
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb,
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco,
];

export const backgroundConfig = {
  imageNames,
  images,
};

const imageElements = new Map();

const getImage = (index: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index];
  });
};

export default function useBackgroundSettings(
  localCameraTrack: ICameraVideoTrack | null,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [backgroundSettings, setBackgroundSettings] = useLocalStorageState<any>(
    SELECTED_BACKGROUND_SETTINGS_KEY,
    window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY) || {
      type: 'none',
      index: 0,
    },
  );

  const extension = new VirtualBackgroundExtension();

  // NOT Support mobile with reference: https://www.npmjs.com/package/agora-extension-virtual-background
  const isSupported = extension.checkCompatibility();

  const checkCompatibility = () => {
    if (!isSupported) {
      console.error('Does not support virtual background!');
      return;
    }
  };

  const processor = useRef<IVirtualBackgroundProcessor | null>(null);

  useEffect(() => {
    const initializeVirtualBackgroundProcessor = async () => {
      if (!localCameraTrack) return;
      AgoraRTC.registerExtensions([extension]);
      checkCompatibility();
      console.log('Initializing virtual background processor...');
      try {
        processor.current = extension.createProcessor();
        await processor.current.init();
        localCameraTrack
          .pipe(processor.current)
          .pipe(localCameraTrack.processorDestination);
      } catch (error) {
        console.error('Error initializing virtual background:', error);
      }
    };

    initializeVirtualBackgroundProcessor();

    return () => {
      const disableVirtualBackground = async () => {
        processor.current?.unpipe();
        localCameraTrack?.unpipe();
        await processor.current?.disable();
      };
      disableVirtualBackground();
    };
  }, [localCameraTrack]);

  useEffect(() => {
    checkCompatibility();
    const handleProcessorChange = async () => {
      if (!processor.current) return;
      if (backgroundSettings.type === BackgroundType.NONE) {
        await processor.current.disable();
        localCameraTrack?.unpipe();
      } else {
        await processor.current.enable();
        if (backgroundSettings.type === BackgroundType.BLUR) {
          processor.current?.setOptions({ type: 'blur', blurDegree: 2 });
        }
        if (backgroundSettings.type === BackgroundType.IMAGE) {
          const source = await getImage(backgroundSettings.index as number);
          processor.current?.setOptions({ type: 'img', source });
        }
        // Pipe the track through the processor
        localCameraTrack
          ?.pipe(processor.current)
          .pipe(localCameraTrack.processorDestination);
      }
    };

    handleProcessorChange();
  }, [backgroundSettings, localCameraTrack]);

  return [isSupported, backgroundSettings, setBackgroundSettings];
}
