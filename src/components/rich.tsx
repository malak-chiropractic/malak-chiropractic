import { Fragment, type ReactNode } from "react";

/** Wrap every "[TO CONFIRM: …]" in a highlighted <mark> so placeholders are impossible to miss. */
export function Inline({ text }: { text: string }): ReactNode {
  if (!text) return null;
  const parts = text.split(/(\[TO CONFIRM:[^\]]*\])/g);
  return parts.map((p, i) =>
    p.startsWith("[TO CONFIRM:") ? (
      <mark key={i} className="tc" title="Placeholder — to be confirmed by the clinic">
        {p}
      </mark>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    )
  );
}

/**
 * Render multi-line CMS text: blank lines separate paragraphs,
 * lines starting with "- " become a bulleted list.
 */
export function Rich({ text, className = "" }: { text: string; className?: string }) {
  if (!text) return null;
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={`prose-malak ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.trim().slice(2)} />
                </li>
              ))}
            </ul>
          );
        }
        // Mixed block: paragraph lines followed by list lines
        const firstListIdx = lines.findIndex((l) => l.trim().startsWith("- "));
        if (firstListIdx > 0) {
          return (
            <Fragment key={i}>
              <p>
                <Inline text={lines.slice(0, firstListIdx).join(" ")} />
              </p>
              <ul>
                {lines.slice(firstListIdx).map((l, j) => (
                  <li key={j}>
                    <Inline text={l.trim().replace(/^- /, "")} />
                  </li>
                ))}
              </ul>
            </Fragment>
          );
        }
        return (
          <p key={i}>
            <Inline text={lines.join(" ")} />
          </p>
        );
      })}
    </div>
  );
}
