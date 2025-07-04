"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "./Typography";
import { useButtonSound } from "@/hooks/useButtonSound";

interface AnswerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  playerName: string;
  score: number;
  onClick: () => void;
  isOver?: boolean;
  isSinglePlayer?: boolean;
}

export const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  (
    {
      playerName,
      score,
      onClick,
      isOver = false,
      isSinglePlayer = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { playButtonSound } = useButtonSound();
    const isDisabled = disabled || isOver;

    const getStateStyles = () => {
      if (isDisabled) {
        return {
          background: "rgba(11, 11, 11, 0.8)",
          border: "1px solid rgba(104, 104, 104, 0.75)",
          color: "#FFFFFF",
        };
      }

      // Default enabled state
      return {
        background: "rgba(36, 36, 47, 0.8)",
        border: "1px solid rgba(169, 199, 255, 0.75)",
        color: "#FFFFFF",
      };
    };

    const getHoverStyles = () => {
      if (isDisabled) return {};

      return {
        background: "rgba(48, 48, 64, 0.8)",
        boxShadow: "8px 8px 30px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const getActiveStyles = () => {
      if (isDisabled) return {};

      return {
        background: "rgba(62, 62, 76, 0.8)",
        boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const styles = getStateStyles();

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        onClick={(e) => {
          if (!isDisabled) {
            playButtonSound();
            onClick();
          }
        }}
        className={cn(
          // Base styles
          "flex flex-col items-center justify-center",
          "rounded-xl transition-all duration-200",
          "gap-4 p-5",
          "min-w-[200px] min-h-[200px]",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
        style={{
          background: styles.background,
          border: styles.border,
          color: styles.color,
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            const hoverStyles = getHoverStyles();
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            Object.assign(e.currentTarget.style, {
              background: styles.background,
              boxShadow: "none",
            });
          }
        }}
        onMouseDown={(e) => {
          if (!isDisabled) {
            const activeStyles = getActiveStyles();
            Object.assign(e.currentTarget.style, activeStyles);
          }
        }}
        onMouseUp={(e) => {
          if (!isDisabled) {
            const hoverStyles = getHoverStyles();
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        {...props}
      >
        {/* Player Name - hidden in single player mode */}
        {!isSinglePlayer && <Typography variant="h2">{playerName}</Typography>}

        {/* Call to Action - only show when not in over state */}
        {!isOver && <Typography variant="h2">Press Here to Answer!</Typography>}

        {/* Score text - only show when round is over */}
        {isOver && <Typography variant="h2">Score</Typography>}

        {/* Score Badge */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(71, 71, 71, 0.15)",
            border: "1px solid rgba(169, 199, 255, 0.75)",
            boxShadow: "4px 4px 20px 0px rgba(99, 99, 99, 0.25)",
          }}
        >
          <Typography variant="h2">{score}</Typography>
        </div>
      </button>
    );
  },
);

AnswerButton.displayName = "AnswerButton";
