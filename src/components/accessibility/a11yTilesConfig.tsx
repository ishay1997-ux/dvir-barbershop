import React from 'react';
import {
  Keyboard,
  Volume2,
  Moon,
  Sun,
  Contrast,
  Eye,
  ZoomIn,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading,
  BookOpen,
  Search,
} from 'lucide-react';
import type { TileItem, A11yState } from './types';
import { A11Y_I18N } from './i18n';

type A11yTranslations = typeof A11Y_I18N.he;

interface BuildTilesParams {
  t: A11yTranslations;
  state: A11yState;
  setState: React.Dispatch<React.SetStateAction<A11yState>>;
  speech: {
    isSpeaking: boolean;
    isSpeechBarOpen: boolean;
    setIsSpeechBarOpen: (open: boolean) => void;
    handlePlayPause: () => void;
  };
  showReaderModal: boolean;
  setShowReaderModal: (show: boolean) => void;
  showFloatingFontToolbar: boolean;
  setShowFloatingFontToolbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: (open: boolean) => void;
}

export function buildA11yTiles({
  t,
  state,
  setState,
  speech,
  showReaderModal,
  setShowReaderModal,
  showFloatingFontToolbar,
  setShowFloatingFontToolbar,
  setIsOpen,
}: BuildTilesParams): TileItem[] {
  return [
    {
      id: 'keyboardNav',
      title: t.keyboardNavTitle,
      desc: t.keyboardNavDesc,
      icon: <Keyboard className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.keyboardNav,
      onClick: () => setState((prev) => ({ ...prev, keyboardNav: !prev.keyboardNav })),
    },
    {
      id: 'speech',
      title: speech.isSpeaking || speech.isSpeechBarOpen ? t.speechStopTitle : t.speechTitle,
      desc: t.speechDesc,
      icon: (
        <Volume2
          className={`acc:w-6 acc:h-6 ${
            speech.isSpeaking ? 'acc:text-[#0088A9] acc:animate-pulse' : 'acc:text-[#085B7A]'
          }`}
        />
      ),
      active: speech.isSpeechBarOpen || speech.isSpeaking,
      onClick: () => {
        speech.setIsSpeechBarOpen(true);
        setIsOpen(false);
        if (!speech.isSpeaking) {
          speech.handlePlayPause();
        }
      },
    },
    {
      id: 'contrastDark',
      title: t.contrastDarkTitle,
      desc: t.contrastDarkDesc,
      icon: <Moon className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.contrastMode === 'dark',
      onClick: () =>
        setState((prev) => ({
          ...prev,
          contrastMode: prev.contrastMode === 'dark' ? 'normal' : 'dark',
        })),
    },
    {
      id: 'contrastLight',
      title: t.contrastLightTitle,
      desc: t.contrastLightDesc,
      icon: <Sun className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.contrastMode === 'light',
      onClick: () =>
        setState((prev) => ({
          ...prev,
          contrastMode: prev.contrastMode === 'light' ? 'normal' : 'light',
        })),
    },
    {
      id: 'contrastInvert',
      title: t.contrastInvertTitle,
      desc: t.contrastInvertDesc,
      icon: <Contrast className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.contrastMode === 'invert',
      onClick: () =>
        setState((prev) => ({
          ...prev,
          contrastMode: prev.contrastMode === 'invert' ? 'normal' : 'invert',
        })),
    },
    {
      id: 'grayscale',
      title: t.grayscaleTitle,
      desc: t.grayscaleDesc,
      icon: <Eye className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.contrastMode === 'grayscale',
      onClick: () =>
        setState((prev) => ({
          ...prev,
          contrastMode: prev.contrastMode === 'grayscale' ? 'normal' : 'grayscale',
        })),
    },
    {
      id: 'screenZoom',
      title: t.screenZoomTitle,
      desc: t.screenZoomDesc,
      icon: <ZoomIn className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.screenZoom,
      onClick: () => setState((prev) => ({ ...prev, screenZoom: !prev.screenZoom })),
    },
    {
      id: 'readableFont',
      title: t.readableFontTitle,
      desc: t.readableFontDesc,
      icon: <Type className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.readableFont,
      onClick: () => setState((prev) => ({ ...prev, readableFont: !prev.readableFont })),
    },
    {
      id: 'imageAlt',
      title: t.imageAltTitle,
      desc: t.imageAltDesc,
      icon: <ImageIcon className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.imageAltTooltips,
      onClick: () => setState((prev) => ({ ...prev, imageAltTooltips: !prev.imageAltTooltips })),
    },
    {
      id: 'highlightLinks',
      title: t.highlightLinksTitle,
      desc: t.highlightLinksDesc,
      icon: <LinkIcon className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.highlightLinks,
      onClick: () => setState((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks })),
    },
    {
      id: 'highlightHeadings',
      title: t.highlightHeadingsTitle,
      desc: t.highlightHeadingsDesc,
      icon: <Heading className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.highlightHeadings,
      onClick: () =>
        setState((prev) => ({ ...prev, highlightHeadings: !prev.highlightHeadings })),
    },
    {
      id: 'readingMode',
      title: t.readingModeTitle,
      desc: t.readingModeDesc,
      icon: <BookOpen className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: showReaderModal,
      onClick: () => setShowReaderModal(true),
    },
    {
      id: 'contentScale',
      title: t.contentScaleTitle,
      desc: t.contentScaleDesc,
      icon: <Search className="acc:w-6 acc:h-6 acc:text-[#085B7A]" />,
      active: state.fontScaleLevel > 0 || showFloatingFontToolbar,
      onClick: () => {
        setShowFloatingFontToolbar((prev) => !prev);
        setState((prev) => ({
          ...prev,
          fontAdjustmentMode: 'size',
          fontScaleLevel: prev.fontScaleLevel === 0 ? 1 : prev.fontScaleLevel,
        }));
      },
    },
    {
      id: 'virtualKeyboard',
      title: t.virtualKeyboardTitle,
      desc: t.virtualKeyboardDesc,
      icon: (
        <div className="acc:w-6 acc:h-6 acc:border-2 acc:border-[#085B7A] acc:rounded-md acc:flex acc:flex-wrap acc:gap-0.5 acc:p-0.5 acc:items-center acc:justify-center">
          <span className="acc:w-1 acc:h-1 acc:bg-[#085B7A] acc:rounded-[1px]" />
          <span className="acc:w-1 acc:h-1 acc:bg-[#085B7A] acc:rounded-[1px]" />
          <span className="acc:w-1 acc:h-1 acc:bg-[#085B7A] acc:rounded-[1px]" />
          <span className="acc:w-1 acc:h-1 acc:bg-[#085B7A] acc:rounded-[1px]" />
          <span className="acc:w-1 acc:h-1 acc:bg-[#085B7A] acc:rounded-[1px]" />
          <span className="acc:w-1 acc:h-1 acc:bg-[#085B7A] acc:rounded-[1px]" />
        </div>
      ),
      active: state.virtualKeyboard,
      onClick: () => setState((prev) => ({ ...prev, virtualKeyboard: !prev.virtualKeyboard })),
    },
  ];
}
