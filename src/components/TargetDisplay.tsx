interface TargetDisplayProps {
  consonant: string;
  vowel: string;
}

export function TargetDisplay({ consonant, vowel }: TargetDisplayProps) {
  return (
    <div className="target-display">
      <div className="target-equation">{consonant} + {vowel}</div>
      <div className="target-hint">Find this compound!</div>
    </div>
  );
}
