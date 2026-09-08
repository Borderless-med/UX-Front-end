interface AIQuickAnswerBoxProps {
  facts: string[];
}

/**
 * "AI Quick Answer" box shown at the top of every blog post.
 *
 * Purpose: Generative Engine Optimization (GEO). This gives AI crawlers
 * (Google AI Overviews, ChatGPT browsing, Perplexity, etc.) a short list of
 * self-contained "atomic facts" that are easy to lift and cite directly,
 * separate from the longer narrative content below.
 */
const AIQuickAnswerBox = ({ facts }: AIQuickAnswerBoxProps) => {
  if (!facts.length) return null;

  return (
    <div
      className="my-8 rounded-xl border border-blue-light bg-blue-150/40 p-5 sm:p-6"
      data-ai-quick-answer="true"
      aria-label="Quick answer summary"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-dark">
        Quick Answer
      </p>
      <ul className="space-y-2.5">
        {facts.map((fact) => (
          <li key={fact} className="flex gap-2.5 text-[15px] leading-relaxed text-gray-800 sm:text-base">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-primary" aria-hidden="true" />
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIQuickAnswerBox;
