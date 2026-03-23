import { useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface WrongAnswer {
  question: {
    operand1: number;
    operand2: number;
    operator: string;
    correctAnswer: number;
  };
  userAnswer: number;
}

interface CoachReviewProps {
  wrongAnswers: WrongAnswer[];
}

const CoachReview = ({ wrongAnswers }: CoachReviewProps) => {
  const [review, setReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const fetchReview = async () => {
    setIsLoading(true);
    setHasStarted(true);
    setReview('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/math-coach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ wrongAnswers }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get review');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let reviewText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              reviewText += content;
              setReview(reviewText);
            }
          } catch {
            // Incomplete JSON, put back and wait
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              reviewText += content;
              setReview(reviewText);
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (error) {
      console.error('Coach review error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get review');
      setReview('');
      setHasStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return (
      <button
        onClick={fetchReview}
        disabled={isLoading}
        className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl 
                 text-lg font-medium shadow-lg hover:shadow-secondary/25 
                 hover:bg-secondary/90 transition-all animate-fade"
      >
        Review with Coach Tobias 🤓
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-secondary/10 to-accent/10 p-4 rounded-xl border border-secondary/20 animate-fade">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🧑‍🏫</span>
        <span className="font-semibold text-secondary">Coach Tobias</span>
        {isLoading && (
          <span className="ml-auto text-xs text-muted-foreground animate-pulse">
            typing...
          </span>
        )}
      </div>
      <div className="prose prose-sm max-w-none text-foreground">
        {review ? (
          <ReactMarkdown>{review}</ReactMarkdown>
        ) : (
          <p className="text-muted-foreground italic">Getting Coach Tobias ready...</p>
        )}
      </div>
    </div>
  );
};

export default CoachReview;
