import React from 'react';

/**
 * 🚀 ProgressBar Component
 *
 * This component renders a customizable progress bar.
 * It takes in `percentage` and `color` props to visually display progress.
 * The progress bar has a gradient effect and updates its width
 * dynamically based on the `percentage` value provided.
 *
 * Props:
 * - `percentage` (number): Progress level to be shown (0 - 100).
 * - `color` (string): Color for the percentage text.
 *
 * Usage:
 * ```tsx
 * <ProgressBar percentage={70} color="#FFFFFF" />
 * ```
 */


interface ProgressBarProps {
  percentage: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color }) => {
  return (
    <div className="flex items-center gap-8 invisible">
      <div className="w-full h-5 bg-[#0b1e4e62] rounded-[16px] flex items-center gap-4 justify-start overflow-hidden">
        <div
          className="h-[13px] mx-1 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 ease-in-out rounded-lg"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span
        style={{ color }}
        className="text-[18px] font-[400]"
      >
        {percentage}%
      </span>
    </div>
  );
};

export default ProgressBar;
