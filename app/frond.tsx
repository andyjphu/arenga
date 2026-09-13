/** arenga pinnata, pinnate and drooping. one leaflet pair per probe, so the mark
 *  tracks the suite instead of decorating it. */
export function Frond({ pairs, className = '' }: { pairs: number; className?: string }) {
  // a point on the rachis, quadratic from the trunk out to the tip
  const at = (t: number) => {
    const u = 1 - t
    return {
      x: u * u * 4 + 2 * u * t * 30 + t * t * 68,
      y: u * u * 35 + 2 * u * t * 34 + t * t * 7,
    }
  }
  return (
    <svg viewBox="0 0 72 42" className={`frond ${className}`} aria-hidden role="presentation">
      <path d="M4 35 Q 30 34 68 7" className="rachis" />
      {Array.from({ length: pairs }, (_, i) => {
        const t = (i + 0.85) / (pairs + 0.6)
        const { x, y } = at(t)
        const l = 16 - 8 * t
        return (
          <g key={i}>
            <path
              d={`M${x} ${y} Q ${x - l * 0.06} ${y - l * 0.68} ${x - l * 0.5} ${y - l * 1.02}`}
            />
            <path
              d={`M${x} ${y} Q ${x + l * 0.16} ${y + l * 0.46} ${x - l * 0.12} ${y + l * 0.86}`}
            />
          </g>
        )
      })}
    </svg>
  )
}
