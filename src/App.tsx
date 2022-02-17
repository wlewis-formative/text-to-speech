import React from 'react';
import Reader, { Boundary } from './Reader';

const App: React.VFC = () => {
  const [text, setText] = React.useState('Test example');

  function updateText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function highlightSpoken(
    text: string,
    boundary?: Boundary
  ): React.ReactNode[] {
    if (!boundary) {
      return [<span key="inactive">{text}</span>];
    }

    const { start: s, length: l } = boundary;
    return [
      <span key="before" className="inactive">
        {text.slice(0, s)}
      </span>,
      <span key="active" className="active">
        {text.slice(s, s + l)}
      </span>,
      <span key="after" className="inactive">
        {text.slice(s + l)}
      </span>,
    ];
  }

  return (
    <main>
      <Reader
        lang="en-US"
        prioritizeVoices={(vA, vB) => {
          if (vA.name.indexOf('Google') >= 0) {
            return -1;
          } else if (vB.name.indexOf('Google') >= 0) {
            return 1;
          } else {
            return 0;
          }
        }}
      >
        {(read, isReading, boundary) => (
          <div>
            <textarea onInput={updateText} value={text} disabled={isReading} />

            <p>{highlightSpoken(text, boundary)}</p>
            <button onClick={() => read(text)} disabled={isReading}>
              {isReading ? 'Pause' : 'Read to me'}
            </button>
          </div>
        )}
      </Reader>
    </main>
  );
};

export default App;
