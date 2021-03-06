import React from 'react';

export default function useReader(config: UseReaderConfig): UseReaderResult {
  const { lang, prioritizeVoices = () => 0 } = config;
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [isReading, setIsReading] = React.useState(false);
  const [boundary, setBoundary] = React.useState<Boundary | undefined>();

  React.useEffect(() => {
    const existingVoices = window.speechSynthesis.getVoices();
    if (existingVoices.length > 0) {
      // Firefox
      setVoices(existingVoices);
      return;
    }

    // Chrome and Safari
    function saveVoices() {
      setVoices(window.speechSynthesis.getVoices());
      window.speechSynthesis.onvoiceschanged = null;
    }
    window.speechSynthesis.onvoiceschanged = saveVoices;
  }, []);

  function read(text: string) {
    setIsReading(true);
    const utterance = new SpeechSynthesisUtterance(text);

    function onBoundary(e: SpeechSynthesisEvent) {
      const { charIndex, charLength } = e;
      setBoundary({ start: charIndex, length: charLength });
    }
    utterance.addEventListener('boundary', onBoundary);

    function onEnd() {
      setIsReading(false);
      utterance.removeEventListener('end', onEnd);
      utterance.removeEventListener('error', onEnd);
      utterance.removeEventListener('boundary', onBoundary);
      setBoundary(undefined);
    }
    utterance.addEventListener('end', onEnd);
    utterance.addEventListener('error', onEnd);

    const langVoices = [...voices.filter(v => (lang ? v.lang === lang : true))];
    langVoices.sort(prioritizeVoices);

    if (langVoices.length > 0) {
      utterance.voice = langVoices[0];
    } else {
      console.warn('no elligible voices found');
    }
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }

  return { read, isReading, boundary };
}

export interface UseReaderConfig {
  lang?: string;
  prioritizeVoices?: (
    vA: SpeechSynthesisVoice,
    vB: SpeechSynthesisVoice
  ) => number;
}

export interface UseReaderResult {
  read: (text: string) => void;
  isReading: boolean;
  boundary?: Boundary;
}

export interface Boundary {
  start: number;
  length: number;
}
