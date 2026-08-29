'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { A11yState } from './types';

interface UseSpeechSynthesisProps {
  language: A11yState['language'];
}

export function useSpeechSynthesis({ language }: UseSpeechSynthesisProps) {
  const [isSpeechBarOpen, setIsSpeechBarOpen] = useState(false);
  const [isSpeechSettingsOpen, setIsSpeechSettingsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [continuousReading, setContinuousReading] = useState(false);

  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const [speechIndex, setSpeechIndex] = useState<number>(0);
  const [speechElements, setSpeechElements] = useState<HTMLElement[]>([]);

  const isPlayingRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load browser speech voices and match to current selected language
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      setAvailableVoices(voices);

      const langCode =
        language === 'he'
          ? 'he'
          : language === 'ar'
          ? 'ar'
          : language === 'ru'
          ? 'ru'
          : 'en';

      const match = voices.find((v) => v.lang.toLowerCase().startsWith(langCode));
      if (match) {
        setSelectedVoice(match);
      } else if (voices.length > 0) {
        setSelectedVoice((prev) => prev || voices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [language]);

  // Extract all meaningful readable text elements across the page
  const extractReadableElements = useCallback((): HTMLElement[] => {
    if (typeof document === 'undefined') return [];
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, p, li, [role="heading"], button, a, [role="button"], td, th, span.font-bold'
      )
    );

    return elements.filter((el) => {
      if (el.closest('.a11y-ignore')) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }
      const text = (el.innerText || el.textContent || '').trim();
      return text.length >= 2;
    });
  }, []);

  // Remove active highlight from all elements
  const clearSpeechHighlights = useCallback(() => {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.a11y-speech-active').forEach((el) => {
      el.classList.remove('a11y-speech-active');
    });
  }, []);

  // Speak element at specific index in sequence
  const speakElementAtIndex = useCallback(
    (index: number, elementsList?: HTMLElement[]) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const list = elementsList && elementsList.length > 0 ? elementsList : speechElements;

      if (!list || list.length === 0) {
        const freshList = extractReadableElements();
        setSpeechElements(freshList);
        if (freshList.length === 0) return;
        speakElementAtIndex(0, freshList);
        return;
      }

      if (index < 0 || index >= list.length) {
        clearSpeechHighlights();
        setIsSpeaking(false);
        setIsPaused(false);
        isPlayingRef.current = false;
        setSpeechIndex(0);
        return;
      }

      clearSpeechHighlights();
      const target = list[index];
      if (!target) return;

      target.classList.add('a11y-speech-active');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      window.speechSynthesis.cancel();
      const text = (target.innerText || target.textContent || '').trim();
      if (!text) {
        if (isPlayingRef.current) speakElementAtIndex(index + 1, list);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang =
        language === 'he'
          ? 'he-IL'
          : language === 'ar'
          ? 'ar-SA'
          : language === 'ru'
          ? 'ru-RU'
          : 'en-US';

      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onend = () => {
        if (isPlayingRef.current) {
          speakElementAtIndex(index + 1, list);
        } else {
          clearSpeechHighlights();
          setIsSpeaking(false);
        }
      };

      utterance.onerror = () => {
        clearSpeechHighlights();
        setIsSpeaking(false);
      };

      currentUtteranceRef.current = utterance;
      setSpeechIndex(index);
      setIsSpeaking(true);
      setIsPaused(false);
      isPlayingRef.current = true;
      window.speechSynthesis.speak(utterance);
    },
    [
      speechElements,
      extractReadableElements,
      clearSpeechHighlights,
      selectedVoice,
      language,
      speechRate,
      speechPitch,
      isMuted,
    ]
  );

  // Play / Pause Toggle
  const handlePlayPause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('דפדפן זה אינו תומך בהקראת טקסט (Web Speech API).');
      return;
    }

    if (isSpeaking) {
      isPlayingRef.current = false;
      window.speechSynthesis.cancel();
      clearSpeechHighlights();
      setIsSpeaking(false);
      setIsPaused(true);
    } else {
      isPlayingRef.current = true;
      const list = speechElements.length > 0 ? speechElements : extractReadableElements();
      setSpeechElements(list);
      speakElementAtIndex(speechIndex, list);
    }
  }, [
    isSpeaking,
    speechElements,
    extractReadableElements,
    speakElementAtIndex,
    speechIndex,
    clearSpeechHighlights,
  ]);

  // Forward >> (Next block)
  const handleNextSentence = useCallback(() => {
    isPlayingRef.current = true;
    const list = speechElements.length > 0 ? speechElements : extractReadableElements();
    setSpeechElements(list);
    const nextIdx = Math.min(list.length - 1, speechIndex + 1);
    speakElementAtIndex(nextIdx, list);
  }, [speechElements, extractReadableElements, speechIndex, speakElementAtIndex]);

  // Rewind << (Previous block)
  const handlePrevSentence = useCallback(() => {
    isPlayingRef.current = true;
    const list = speechElements.length > 0 ? speechElements : extractReadableElements();
    setSpeechElements(list);
    const prevIdx = Math.max(0, speechIndex - 1);
    speakElementAtIndex(prevIdx, list);
  }, [speechElements, extractReadableElements, speechIndex, speakElementAtIndex]);

  // Restart 🔄 (From beginning)
  const handleRestartSpeech = useCallback(() => {
    isPlayingRef.current = true;
    const list = extractReadableElements();
    setSpeechElements(list);
    speakElementAtIndex(0, list);
  }, [extractReadableElements, speakElementAtIndex]);

  // Close floating speech player bar
  const handleCloseSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isPlayingRef.current = false;
    clearSpeechHighlights();
    setIsSpeechBarOpen(false);
    setIsSpeaking(false);
    setIsPaused(false);
    setContinuousReading(false);
    setIsSpeechSettingsOpen(false);
  }, [clearSpeechHighlights]);

  // Toggle Mute 🔊 / 🔇
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Toggle Continuous Reading 📑 (Hover over any text to read)
  const handleToggleContinuous = useCallback(() => {
    setContinuousReading((prev) => {
      const next = !prev;
      if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        clearSpeechHighlights();
        setIsSpeaking(false);
      }
      return next;
    });
  }, [clearSpeechHighlights]);

  // Continuous Reading Listener (Hover-to-read across all elements)
  useEffect(() => {
    if (!continuousReading || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    let hoverTimeout: NodeJS.Timeout | null = null;
    let hoveredEl: HTMLElement | null = null;

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest('.a11y-ignore')) return;

      const text = (target.innerText || target.textContent || '').trim();
      if (!text || text.length < 2) return;

      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        if (hoveredEl) hoveredEl.classList.remove('a11y-speech-active');
        hoveredEl = target;
        target.classList.add('a11y-speech-active');

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.lang =
          language === 'he'
            ? 'he-IL'
            : language === 'ar'
            ? 'ar-SA'
            : language === 'ru'
            ? 'ru-RU'
            : 'en-US';
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        utterance.volume = isMuted ? 0 : 1;
        utterance.onend = () => {
          target.classList.remove('a11y-speech-active');
        };
        utterance.onerror = () => {
          target.classList.remove('a11y-speech-active');
        };
        window.speechSynthesis.speak(utterance);
      }, 150);
    };

    document.addEventListener('mouseover', handleHover);
    return () => {
      document.removeEventListener('mouseover', handleHover);
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (hoveredEl) (hoveredEl as HTMLElement).classList.remove('a11y-speech-active');
    };
  }, [continuousReading, selectedVoice, speechRate, speechPitch, isMuted, language]);

  return {
    isSpeechBarOpen,
    setIsSpeechBarOpen,
    isSpeechSettingsOpen,
    setIsSpeechSettingsOpen,
    isSpeaking,
    isPaused,
    isMuted,
    continuousReading,
    speechPitch,
    setSpeechPitch,
    speechRate,
    setSpeechRate,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    handlePlayPause,
    handleNextSentence,
    handlePrevSentence,
    handleRestartSpeech,
    handleCloseSpeech,
    handleToggleMute,
    handleToggleContinuous,
  };
}
