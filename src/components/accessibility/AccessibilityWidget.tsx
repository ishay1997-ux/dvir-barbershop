'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

import { A11yState, TileItem } from './types';
import { A11Y_I18N } from './i18n';
import { useAccessibility } from './useAccessibility';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import {
  FloatingTrigger,
  DrawerHeader,
  FeatureTilesGrid,
  MouseCursorCard,
  FontAdjustmentsCard,
  ColorSpectrumCard,
  StopAnimationsCard,
  DrawerFooter,
  VirtualKeyboard,
  ReaderModal,
  SpeechPlayer,
  SpeechSettingsModal,
} from './components';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>('left');
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<TileItem | null>(null);
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // 1. Accessibility State & Side-Effects Hook
  const {
    isClient,
    state,
    setState,
    isModified,
    colorSliderRef,
    currentTargetHue,
    currentLevel,
    maxLevel,
    handleColorSpectrumClick,
    handleResetColors,
    handleToggleCursor,
    handleStepperIncrease,
    handleStepperDecrease,
    resetAllState,
  } = useAccessibility();

  // 2. Web Speech API Synthesis Hook
  const speech = useSpeechSynthesis({ language: state.language });

  // 3. Translations & Direction
  const t = A11Y_I18N[state.language] || A11Y_I18N.he;
  const isRtl = state.language === 'he' || state.language === 'ar';
  const currentDirection = isRtl ? 'rtl' : 'ltr';

  // 4. Listen to focus events to support virtual keyboard typing into any active input
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        !target.closest('.a11y-ignore')
      ) {
        setActiveInput(target as HTMLInputElement | HTMLTextAreaElement);
      }
    };

    window.addEventListener('focusin', handleFocus);
    return () => window.removeEventListener('focusin', handleFocus);
  }, []);

  // 5. Global Keyboard Shortcuts: Alt + A opens accessibility drawer, Escape closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsLanguageOpen(false);
        setShowReaderModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 6. Virtual Keyboard Actions
  const handleVirtualKeyPress = useCallback(
    (char: string) => {
      if (!activeInput) return;
      const start = activeInput.selectionStart || activeInput.value.length;
      const end = activeInput.selectionEnd || activeInput.value.length;
      const val = activeInput.value;
      const newVal = val.slice(0, start) + char + val.slice(end);
      activeInput.value = newVal;
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start + char.length, start + char.length);
      activeInput.focus();
    },
    [activeInput]
  );

  const handleVirtualBackspace = useCallback(() => {
    if (!activeInput) return;
    const start = activeInput.selectionStart || activeInput.value.length;
    const end = activeInput.selectionEnd || activeInput.value.length;
    const val = activeInput.value;
    if (start === end && start > 0) {
      activeInput.value = val.slice(0, start - 1) + val.slice(end);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start - 1, start - 1);
    } else if (start !== end) {
      activeInput.value = val.slice(0, start) + val.slice(end);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start, start);
    }
    activeInput.focus();
  }, [activeInput]);

  // 7. Reset all modifications
  const handleResetAll = useCallback(() => {
    speech.handleCloseSpeech();
    setShowReaderModal(false);
    resetAllState();
  }, [speech, resetAllState]);

  // 8. 14 Core Tiles
  const a11yTiles: TileItem[] = useMemo(
    () => [
      {
        id: 'keyboardNav',
        title: t.keyboardNavTitle,
        desc: t.keyboardNavDesc,
        icon: <Keyboard className="w-6 h-6 text-[#085B7A]" />,
        active: state.keyboardNav,
        onClick: () => setState((prev) => ({ ...prev, keyboardNav: !prev.keyboardNav })),
      },
      {
        id: 'speech',
        title: speech.isSpeaking || speech.isSpeechBarOpen ? t.speechStopTitle : t.speechTitle,
        desc: t.speechDesc,
        icon: (
          <Volume2
            className={`w-6 h-6 ${
              speech.isSpeaking ? 'text-[#0088A9] animate-pulse' : 'text-[#085B7A]'
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
        icon: <Moon className="w-6 h-6 text-[#085B7A]" />,
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
        icon: <Sun className="w-6 h-6 text-[#085B7A]" />,
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
        icon: <Contrast className="w-6 h-6 text-[#085B7A]" />,
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
        icon: <Eye className="w-6 h-6 text-[#085B7A]" />,
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
        icon: <ZoomIn className="w-6 h-6 text-[#085B7A]" />,
        active: state.screenZoom,
        onClick: () => setState((prev) => ({ ...prev, screenZoom: !prev.screenZoom })),
      },
      {
        id: 'readableFont',
        title: t.readableFontTitle,
        desc: t.readableFontDesc,
        icon: <Type className="w-6 h-6 text-[#085B7A]" />,
        active: state.readableFont,
        onClick: () => setState((prev) => ({ ...prev, readableFont: !prev.readableFont })),
      },
      {
        id: 'imageAlt',
        title: t.imageAltTitle,
        desc: t.imageAltDesc,
        icon: <ImageIcon className="w-6 h-6 text-[#085B7A]" />,
        active: state.imageAltTooltips,
        onClick: () => setState((prev) => ({ ...prev, imageAltTooltips: !prev.imageAltTooltips })),
      },
      {
        id: 'highlightLinks',
        title: t.highlightLinksTitle,
        desc: t.highlightLinksDesc,
        icon: <LinkIcon className="w-6 h-6 text-[#085B7A]" />,
        active: state.highlightLinks,
        onClick: () => setState((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks })),
      },
      {
        id: 'highlightHeadings',
        title: t.highlightHeadingsTitle,
        desc: t.highlightHeadingsDesc,
        icon: <Heading className="w-6 h-6 text-[#085B7A]" />,
        active: state.highlightHeadings,
        onClick: () => setState((prev) => ({ ...prev, highlightHeadings: !prev.highlightHeadings })),
      },
      {
        id: 'readingMode',
        title: t.readingModeTitle,
        desc: t.readingModeDesc,
        icon: <BookOpen className="w-6 h-6 text-[#085B7A]" />,
        active: showReaderModal,
        onClick: () => setShowReaderModal(true),
      },
      {
        id: 'contentScale',
        title: t.contentScaleTitle,
        desc: t.contentScaleDesc,
        icon: <Search className="w-6 h-6 text-[#085B7A]" />,
        active: state.fontScaleLevel > 0,
        onClick: () =>
          setState((prev) => ({
            ...prev,
            fontAdjustmentMode: 'size',
            fontScaleLevel: prev.fontScaleLevel >= 5 ? 0 : prev.fontScaleLevel + 1,
          })),
      },
      {
        id: 'virtualKeyboard',
        title: t.virtualKeyboardTitle,
        desc: t.virtualKeyboardDesc,
        icon: (
          <div className="w-6 h-6 border-2 border-[#085B7A] rounded-md flex flex-wrap gap-0.5 p-0.5 items-center justify-center">
            <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
            <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
            <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
            <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
            <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
            <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          </div>
        ),
        active: state.virtualKeyboard,
        onClick: () => setState((prev) => ({ ...prev, virtualKeyboard: !prev.virtualKeyboard })),
      },
    ],
    [t, speech, state, showReaderModal, setState]
  );

  if (!isClient) return null;

  return (
    <>
      {/* 1. Floating Accessibility Button */}
      <FloatingTrigger
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dockSide={dockSide}
        isHiddenTemporarily={isHiddenTemporarily}
        isModified={isModified}
        t={t}
        currentDirection={currentDirection}
      />

      {/* 2. Main Accessibility Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <div
            className={`fixed inset-0 z-[99999] flex items-stretch ${
              dockSide === 'right' ? 'justify-end' : 'justify-start'
            } p-0 sm:p-4 bg-black/60 backdrop-blur-xs a11y-ignore`}
            dir="ltr"
          >
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, x: dockSide === 'right' ? 80 : -80, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dockSide === 'right' ? 80 : -80, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="relative w-full sm:w-[440px] h-full sm:h-auto max-h-full sm:max-h-[96vh] overflow-y-auto bg-white rounded-none sm:rounded-3xl shadow-2xl border border-slate-300 text-[#1C1C1C] flex flex-col z-10 font-sans"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-main-title"
              dir={currentDirection}
            >
              {/* TOP HEADER */}
              <DrawerHeader
                onClose={() => setIsOpen(false)}
                isLanguageOpen={isLanguageOpen}
                setIsLanguageOpen={setIsLanguageOpen}
                language={state.language}
                onSelectLanguage={(lang) => setState((prev) => ({ ...prev, language: lang }))}
                onHideWidget={() => {
                  setIsHiddenTemporarily(true);
                  setIsOpen(false);
                }}
                onToggleDockSide={() => setDockSide((prev) => (prev === 'right' ? 'left' : 'right'))}
                t={t}
                isRtl={isRtl}
              />

              {/* BODY CONTENT */}
              <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
                {/* 14 Tiles Grid */}
                <FeatureTilesGrid
                  tiles={a11yTiles}
                  hoveredTile={hoveredTile}
                  setHoveredTile={setHoveredTile}
                  t={t}
                  isRtl={isRtl}
                />

                {/* Mouse Cursor Card */}
                <MouseCursorCard
                  cursorMode={state.cursorMode}
                  bigCursor={state.bigCursor}
                  onToggleCursor={handleToggleCursor}
                  t={t}
                  currentDirection={currentDirection}
                  isRtl={isRtl}
                />

                {/* Font Adjustments Card */}
                <FontAdjustmentsCard
                  fontAdjustmentMode={state.fontAdjustmentMode}
                  onSelectMode={(mode) => setState((prev) => ({ ...prev, fontAdjustmentMode: mode }))}
                  currentLevel={currentLevel}
                  maxLevel={maxLevel}
                  onStepperIncrease={handleStepperIncrease}
                  onStepperDecrease={handleStepperDecrease}
                  t={t}
                  currentDirection={currentDirection}
                  isRtl={isRtl}
                />

                {/* Color Spectrum Card */}
                <ColorSpectrumCard
                  colorTarget={state.colorTarget}
                  onSelectTarget={(target) => setState((prev) => ({ ...prev, colorTarget: target }))}
                  currentTargetHue={currentTargetHue}
                  onColorSpectrumClick={handleColorSpectrumClick}
                  onResetColors={handleResetColors}
                  colorSliderRef={colorSliderRef}
                  t={t}
                />

                {/* Stop Animations Card */}
                <StopAnimationsCard
                  stopAnimations={state.stopAnimations}
                  onToggleStopAnimations={() =>
                    setState((prev) => ({ ...prev, stopAnimations: !prev.stopAnimations }))
                  }
                  t={t}
                />
              </div>

              {/* BOTTOM FOOTER */}
              <DrawerFooter
                onResetAll={handleResetAll}
                onClose={() => setIsOpen(false)}
                t={t}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. On-Screen Virtual Keyboard */}
      <VirtualKeyboard
        isOpen={state.virtualKeyboard}
        onClose={() => setState((prev) => ({ ...prev, virtualKeyboard: false }))}
        language={state.language}
        onKeyPress={handleVirtualKeyPress}
        onBackspace={handleVirtualBackspace}
        t={t}
        currentDirection={currentDirection}
      />

      {/* 4. Accessible Reader & Print Mode Modal */}
      <ReaderModal
        isOpen={showReaderModal}
        onClose={() => setShowReaderModal(false)}
        t={t}
        currentDirection={currentDirection}
      />

      {/* 5. Floating Speech Player Bar */}
      <SpeechPlayer
        isOpen={speech.isSpeechBarOpen}
        onClose={speech.handleCloseSpeech}
        isSpeaking={speech.isSpeaking}
        isMuted={speech.isMuted}
        onToggleMute={speech.handleToggleMute}
        onPlayPause={speech.handlePlayPause}
        onPrev={speech.handlePrevSentence}
        onNext={speech.handleNextSentence}
        onRestart={speech.handleRestartSpeech}
        continuousReading={speech.continuousReading}
        onToggleContinuous={speech.handleToggleContinuous}
        isSpeechSettingsOpen={speech.isSpeechSettingsOpen}
        onToggleSpeechSettings={() => speech.setIsSpeechSettingsOpen((prev) => !prev)}
        t={t}
      />

      {/* 6. Speech Settings Modal Dialog */}
      <SpeechSettingsModal
        isOpen={speech.isSpeechSettingsOpen}
        onClose={() => speech.setIsSpeechSettingsOpen(false)}
        language={state.language}
        selectedVoice={speech.selectedVoice}
        availableVoices={speech.availableVoices}
        onSelectVoice={speech.setSelectedVoice}
        speechPitch={speech.speechPitch}
        setSpeechPitch={speech.setSpeechPitch}
        speechRate={speech.speechRate}
        setSpeechRate={speech.setSpeechRate}
        t={t}
      />
    </>
  );
}

export { AccessibilityWidget };
