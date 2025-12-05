import { useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shape } from './Shape';
import type { NPC } from '@/types/game';
import { cn } from '@/lib/utils';

interface QuestDialogProps {
  npc: NPC | null;
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (answerIndex: number) => void;
  answeredCorrectly: boolean | null;
  showFeedback: boolean;
}

export function QuestDialog({
  npc,
  isOpen,
  onClose,
  onAnswer,
  answeredCorrectly,
  showFeedback,
}: QuestDialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !npc || showFeedback) return;

      // Number keys 1-4 to select options
      const key = e.key;
      if (key >= '1' && key <= '4') {
        const index = parseInt(key) - 1;
        if (index < npc.quest.options.length) {
          onAnswer(index);
        }
      }
    },
    [isOpen, npc, showFeedback, onAnswer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!npc) return null;

  const { quest } = npc;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {/* NPC Shape */}
            <div
              className="flex-shrink-0 p-3 rounded-lg"
              style={{ backgroundColor: `${quest.npcColor}20` }}
            >
              <Shape type={quest.npcShape} color={quest.npcColor} size={48} />
            </div>

            <div>
              <DialogTitle className="text-xl text-white">
                {quest.npcName}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Quest Giver
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-lg text-slate-200 leading-relaxed">
              "{quest.question}"
            </p>
          </div>

          {/* Feedback message */}
          {showFeedback && (
            <div
              className={cn(
                'rounded-lg p-4 border animate-in fade-in slide-in-from-bottom-2 duration-300',
                answeredCorrectly
                  ? 'bg-green-900/30 border-green-700 text-green-300'
                  : 'bg-red-900/30 border-red-700 text-red-300'
              )}
            >
              <p className="font-medium">
                {answeredCorrectly ? quest.correctResponse : quest.wrongResponse}
              </p>
            </div>
          )}

          {/* Answer options */}
          {!showFeedback && (
            <div className="grid gap-3">
              {quest.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left h-auto py-3 px-4',
                    'bg-slate-800/50 border-slate-600 text-slate-200',
                    'hover:bg-slate-700 hover:border-slate-500 hover:text-white',
                    'transition-all duration-200'
                  )}
                  onClick={() => onAnswer(index)}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-700 text-sm font-mono mr-3">
                    {index + 1}
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          )}

          {/* Continue button after feedback */}
          {showFeedback && (
            <Button
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
              onClick={onClose}
            >
              Continue Exploring
            </Button>
          )}
        </div>

        {/* Keyboard hints */}
        {!showFeedback && (
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800">
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">1-4</kbd> to
              answer
            </span>
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">ESC</kbd> to
              close
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
