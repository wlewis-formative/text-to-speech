import React from 'react';
import useReader, { UseReaderConfig, UseReaderResult } from './useReader';

export interface ReaderProps extends UseReaderConfig {
  children: (config: UseReaderResult) => React.ReactNode;
}

const Reader: React.FC<ReaderProps> = props => {
  const { children, lang, prioritizeVoices } = props;
  const { read, isReading, boundary } = useReader({ lang, prioritizeVoices });

  return (
    <React.Fragment>{children({ read, isReading, boundary })}</React.Fragment>
  );
};

export default Reader;
