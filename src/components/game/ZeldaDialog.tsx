import { useState, useEffect, useCallback, useRef } from 'react';
import { Shape } from './Shape';
import type { NPC } from '@/types/game';
import { cn } from '@/lib/utils';

interface ZeldaDialogProps {
  npc: NPC | null;
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (answerIndex: number) => void;
  answeredCorrectly: boolean | null;
  showFeedback: boolean;
  isAlreadyCompleted?: boolean;
}

function useTypewriter(text: string, speed: number = 30, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  const skipToEnd = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);

  return { displayedText, isComplete, skipToEnd };
}

// Thank you messages for completed quests
const THANK_YOU_MESSAGES = [
  "You've already helped me, brave adventurer! Thank you!",
  "Ah, my friend! You solved my riddle before. Safe travels!",
  "The answer you gave was most wise. I remember you well!",
  "Hero! You've already proven your worth to me.",
  "Your wisdom still echoes in my memory. Thank you again!",
];

function getThankYouMessage(questId: string): string {
  // Use quest ID to get consistent message for same NPC
  const index = questId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return THANK_YOU_MESSAGES[index % THANK_YOU_MESSAGES.length];
}

export function ZeldaDialog({
  npc,
  isOpen,
  onClose,
  onAnswer,
  answeredCorrectly,
  showFeedback,
  isAlreadyCompleted = false,
}: ZeldaDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const question = npc?.quest.question ?? '';
  const thankYouMessage = npc ? getThankYouMessage(npc.quest.id) : '';

  const textToShow = isAlreadyCompleted ? thankYouMessage : question;

  const { displayedText, isComplete, skipToEnd } = useTypewriter(
    textToShow,
    25,
    isOpen && !showFeedback
  );

  // Handle slide animation
  useEffect(() => {
    if (isOpen) {
      // Small delay before showing to trigger animation
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Reset selected index when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !npc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // For already completed quests, any key closes
      if (isAlreadyCompleted) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
        return;
      }

      const options = npc.quest.options;

      if (showFeedback) {
        // Any key closes after feedback
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
        return;
      }

      // Skip typewriter effect
      if (!isComplete && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        skipToEnd();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isComplete) {
            onAnswer(selectedIndex);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          const numIndex = parseInt(e.key) - 1;
          if (numIndex < options.length && isComplete) {
            setSelectedIndex(numIndex);
            onAnswer(numIndex);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, npc, showFeedback, isComplete, selectedIndex, onAnswer, onClose, skipToEnd, isAlreadyCompleted]);

  if (!npc || !isOpen) return null;

  const { quest } = npc;

  return (
    <>
      {/* Overlay - dims the game */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Dialog Box */}
      <div
        ref={dialogRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out',
          isVisible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Retro border frame */}
        <div className="mx-4 mb-4 sm:mx-8 sm:mb-8">
          <div
            className={cn(
              "relative border-4 shadow-[0_0_20px_rgba(255,215,0,0.3),inset_0_0_30px_rgba(0,0,0,0.5)]",
              isAlreadyCompleted
                ? "bg-[#1a1a2e] border-[#666]"
                : "bg-[#0f0f1e] border-[#ffd700]"
            )}
            style={{
              minHeight: '25vh',
              maxHeight: '35vh',
            }}
          >
            {/* Corner decorations */}
            <div className={cn("absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4", isAlreadyCompleted ? "border-[#666]" : "border-[#ffd700]")} />
            <div className={cn("absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4", isAlreadyCompleted ? "border-[#666]" : "border-[#ffd700]")} />
            <div className={cn("absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4", isAlreadyCompleted ? "border-[#666]" : "border-[#ffd700]")} />
            <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4", isAlreadyCompleted ? "border-[#666]" : "border-[#ffd700]")} />

            {/* Completed badge */}
            {isAlreadyCompleted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="font-retro text-[8px] text-[#00ff00] bg-[#1a1a2e] border border-[#00ff00] px-3 py-1">
                  ✓ COMPLETED
                </div>
              </div>
            )}

            <div className="flex h-full p-4 sm:p-6 gap-4 sm:gap-6">
              {/* NPC Portrait */}
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 border-2 flex items-center justify-center",
                    isAlreadyCompleted ? "border-[#666]" : "border-[#ffd700]"
                  )}
                  style={{
                    backgroundColor: isAlreadyCompleted ? '#33333330' : `${quest.npcColor}30`,
                    opacity: isAlreadyCompleted ? 0.6 : 1,
                  }}
                >
                  <Shape
                    type={quest.npcShape}
                    color={isAlreadyCompleted ? '#666' : quest.npcColor}
                    size={40}
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* NPC Name */}
                <h3 className={cn(
                  "font-retro text-xs sm:text-sm mb-2 sm:mb-3 tracking-wide",
                  isAlreadyCompleted ? "text-[#888]" : "text-[#ffd700]"
                )}>
                  {quest.npcName}
                </h3>

                {isAlreadyCompleted ? (
                  /* Already completed message */
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-retro text-[#888] text-[10px] sm:text-xs leading-relaxed">
                      {displayedText}
                      {!isComplete && (
                        <span className="inline-block w-2 h-3 bg-[#888] ml-1 animate-pulse" />
                      )}
                    </p>
                    {isComplete && (
                      <p className="font-retro text-[#666] text-[8px] mt-4 animate-pulse">
                        Press ENTER to continue...
                      </p>
                    )}
                  </div>
                ) : !showFeedback ? (
                  <>
                    {/* Question with typewriter effect */}
                    <p className="font-retro text-white text-[10px] sm:text-xs leading-relaxed mb-3 sm:mb-4">
                      {displayedText}
                      {!isComplete && (
                        <span className="inline-block w-2 h-3 bg-white ml-1 animate-pulse" />
                      )}
                    </p>

                    {/* Answer options */}
                    {isComplete && (
                      <div className="space-y-1 sm:space-y-2 overflow-y-auto max-h-24 sm:max-h-32">
                        {quest.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedIndex(index);
                              onAnswer(index);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={cn(
                              'w-full text-left font-retro text-[8px] sm:text-[10px] py-1 px-2 transition-colors duration-100 flex items-center gap-2',
                              selectedIndex === index
                                ? 'text-[#00ff00] bg-[#00ff00]/10'
                                : 'text-[#f0f0f0] hover:text-[#ffff00]'
                            )}
                          >
                            <span
                              className={cn(
                                'transition-opacity',
                                selectedIndex === index ? 'opacity-100' : 'opacity-0'
                              )}
                            >
                              ►
                            </span>
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Feedback message */
                  <div className="flex-1 flex flex-col justify-center">
                    <p
                      className={cn(
                        'font-retro text-[10px] sm:text-xs leading-relaxed',
                        answeredCorrectly ? 'text-[#00ff00]' : 'text-[#ff6b6b]'
                      )}
                    >
                      {answeredCorrectly ? quest.correctResponse : quest.wrongResponse}
                    </p>
                    <p className="font-retro text-[#888] text-[8px] mt-4 animate-pulse">
                      Press ENTER to continue...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom hint */}
            {!showFeedback && isComplete && !isAlreadyCompleted && (
              <div className="absolute bottom-2 right-4 font-retro text-[#666] text-[6px] sm:text-[8px]">
                ↑↓ SELECT • ENTER CONFIRM • ESC CLOSE
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
