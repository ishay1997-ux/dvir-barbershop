'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { A11yState, TileItem } from './types';
import { A11Y_I18N } from './i18n';
import { useAccessibility } from './useAccessibility';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useA11yShortcuts } from './useA11yShortcuts';
import { buildA11yTiles } from './a11yTilesConfig';
import {
  FloatingTrigger,
  DrawerHeader,
  FeatureTilesGrid,
  MouseCursorCard,
  FontAdjustmentsCard,
  FloatingFontToolbar,
  ColorSpectrumCard,
  StopAnimationsCard,
  DrawerFooter,
  VirtualKeyboard,
  ReaderModal,
  SpeechPlayer,
  SpeechSettingsModal,
  HideWidgetModal,
  HideDuration,
} from './components';
import './accessibility.css';

export interface AccessibilityWidgetProps {
  /** Custom business or site name for reader view and statements */
  siteName?: string;
  /** Custom accessibility statement page URL (default: '/accessibility') */
  statementUrl?: string;
  /** Initial dock side ('left' | 'right', default: 'left') */
  defaultDockSide?: 'left' | 'right';
  /** Custom localStorage key prefix (default: 'thecut_a11y_v3_state') */
  storageKey?: string;
  /** Initial language (default: 'he') */
  defaultLanguage?: A11yState['language'];
}

export default function AccessibilityWidget({
  siteName,
  statementUrl = '/accessibility',
  defaultDockSide = 'left',
  storageKey,
  defaultLanguage,
}: AccessibilityWidgetProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>(defaultDockSide);
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [showFloatingFontToolbar, setShowFloatingFontToolbar] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<TileItem | null>(null);

  const activeHideStorageKey = storageKey ? `${storageKey}_hidden_until` : 'thecut_a11y_hidden_until';
  const activeHideSessionKey = storageKey ? `${storageKey}_hidden_session` : 'thecut_a11y_hidden_session';

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
  } = useAccessibility({ storageKey, defaultLanguage });

  // 2. Web Speech API Synthesis Hook
  const speech = useSpeechSynthesis({ language: state.language });

  // 3. Translations & Direction
  const t = A11Y_I18N[state.language] || A11Y_I18N.he;
  const isRtl = state.language === 'he' || state.language === 'ar';
  const currentDirection = isRtl ? 'rtl' : 'ltr';

  // 4. Shortcuts & Virtual Keyboard Input Listener
  const { handleVirtualKeyPress, handleVirtualBackspace } = useA11yShortcuts({
    setState,
    setIsOpen,
    setIsLanguageOpen,
    setShowReaderModal,
    setIsHideModalOpen,
  });

  // 5. Check whether accessibility button was hidden by user preference
  useEffect(() => {
    try {
      const sessionHidden = sessionStorage.getItem(activeHideSessionKey);
      if (sessionHidden === 'true') {
        setIsHiddenTemporarily(true);
        return;
      }
      const hiddenUntil = localStorage.getItem(activeHideStorageKey);
      if (hiddenUntil && Date.now() < Number(hiddenUntil)) {
        setIsHiddenTemporarily(true);
      } else if (hiddenUntil) {
        localStorage.removeItem(activeHideStorageKey);
      }
    } catch {
      // Ignore
    }
  }, [activeHideSessionKey, activeHideStorageKey]);

  // 6. Hide Button Handler
  const handleConfirmHide = useCallback(
    (duration: HideDuration) => {
      try {
        if (duration === 'session') {
          sessionStorage.setItem(activeHideSessionKey, 'true');
        } else {
          const msMap: Record<'24h' | '1w' | '1m', number> = {
            '24h': 24 * 60 * 60 * 1000,
            '1w': 7 * 24 * 60 * 60 * 1000,
            '1m': 30 * 24 * 60 * 60 * 1000,
          };
          const until = Date.now() + msMap[duration];
          localStorage.setItem(activeHideStorageKey, until.toString());
        }
      } catch {
        // Ignore
      }
      setIsHiddenTemporarily(true);
      setIsHideModalOpen(false);
      setIsOpen(false);
    },
    [activeHideSessionKey, activeHideStorageKey]
  );

  // 7. Reset all modifications
  const handleResetAll = useCallback(() => {
    speech.handleCloseSpeech();
    setShowReaderModal(false);
    setShowFloatingFontToolbar(false);
    resetAllState();
  }, [speech, resetAllState]);

  // 8. 14 Core Tiles
  const a11yTiles: TileItem[] = useMemo(
    () =>
      buildA11yTiles({
        t,
        state,
        setState,
        speech,
        showReaderModal,
        setShowReaderModal,
        showFloatingFontToolbar,
        setShowFloatingFontToolbar,
        setIsOpen,
      }),
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
              className="relative w-full sm:w-[490px] sm:max-w-[94vw] h-full sm:h-auto max-h-full sm:max-h-[96vh] overflow-y-auto bg-white rounded-none sm:rounded-3xl shadow-2xl border border-slate-300 text-[#1C1C1C] flex flex-col z-10 font-sans"
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
                onHideWidget={() => setIsHideModalOpen(true)}
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
                  currentDirection={currentDirection}
                  isRtl={isRtl}
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
                statementUrl={statementUrl}
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

      {/* 4. On-Screen Floating Font & Spacing Toolbar */}
      <FloatingFontToolbar
        isOpen={showFloatingFontToolbar}
        onClose={() => setShowFloatingFontToolbar(false)}
        fontAdjustmentMode={state.fontAdjustmentMode}
        onSelectMode={(mode) => setState((prev) => ({ ...prev, fontAdjustmentMode: mode }))}
        currentLevel={currentLevel}
        maxLevel={maxLevel}
        onStepperIncrease={handleStepperIncrease}
        onStepperDecrease={handleStepperDecrease}
        dockSide={dockSide}
        t={t}
        isRtl={isRtl}
      />

      {/* 4. Accessible Reader & Print Mode Modal */}
      <ReaderModal
        isOpen={showReaderModal}
        onClose={() => setShowReaderModal(false)}
        siteName={siteName}
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

      {/* 7. Hide Accessibility Widget Option Modal */}
      <HideWidgetModal
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onConfirmHide={handleConfirmHide}
        t={t}
        currentDirection={currentDirection}
        isRtl={isRtl}
      />
    </>
  );
}

export { AccessibilityWidget };
