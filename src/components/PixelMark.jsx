export default function PixelMark({ size = 20 }) {
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="pixel-mark"
    >
      <g fill="currentColor">
        <rect x="3" y="1" width="2" height="1" />
        <rect x="2" y="2" width="4" height="1" />
        <rect x="1" y="3" width="6" height="2" />
        <rect x="2" y="5" width="4" height="1" />
        <rect x="3" y="6" width="2" height="1" />
      </g>
    </svg>
  )
}
