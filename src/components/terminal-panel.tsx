import { SectionHeading } from "@/components/section-heading";

/**
 * The terminal window's look, in one place.
 *
 * The blur is load-bearing, not styling. Content sits over a live WebGL ASCII
 * moon and a star field; without a blurred pane behind it, body copy lands
 * directly on moving glyph texture and stops being readable. Same
 * translucent-with-blur call as TASK-homepage-glass-sections.md, moved up from
 * individual cards to the window itself.
 *
 * `ScrollMorphStage` composes these classes into ONE window that resizes
 * between sections rather than rendering a panel per section — see the note
 * there. `TerminalPanel` below is the static single-view version, for places
 * that aren't a morph stage.
 */
export const WINDOW_FRAME =
  "relative border border-panel-edge bg-panel backdrop-blur-md";
export const WINDOW_TITLEBAR =
  "flex items-center gap-3 border-b border-panel-edge px-5 py-2.5 sm:px-7";
export const WINDOW_BODY = "px-5 py-8 sm:px-7 sm:py-10";

/** The title bar's trailing rule. It measures the window and gives the label
 * an edge to sit against — one device, rather than the corner ticks and status
 * line that are the templated terminal move (three accessories where one does
 * the work). */
export function TitleRule() {
  return <span aria-hidden="true" className="h-px flex-1 bg-panel-edge" />;
}

export function TerminalPanel({
  number,
  label,
  className = "",
  bodyClassName = "",
  style,
  children,
}: {
  number: string;
  label: string;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div style={style} className={`${WINDOW_FRAME} mx-auto w-full ${className}`}>
      <div className={WINDOW_TITLEBAR}>
        <SectionHeading number={number} label={label} className="whitespace-nowrap" />
        <TitleRule />
      </div>
      <div className={`${WINDOW_BODY} ${bodyClassName}`}>{children}</div>
    </div>
  );
}
