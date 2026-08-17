const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ChevronLeft(props) {
  return (
    <svg {...base} width={props.size ?? 18} height={props.size ?? 18} aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function ChevronRight(props) {
  return (
    <svg {...base} width={props.size ?? 18} height={props.size ?? 18} aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function Close(props) {
  return (
    <svg {...base} width={props.size ?? 16} height={props.size ?? 16} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function Plus(props) {
  return (
    <svg {...base} width={props.size ?? 16} height={props.size ?? 16} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function Sparkle(props) {
  return (
    <svg {...base} width={props.size ?? 16} height={props.size ?? 16} aria-hidden="true">
      <path d="M12 3l1.6 5.1L19 9.7l-5.4 1.6L12 16.4l-1.6-5.1L5 9.7l5.4-1.6L12 3z" />
      <path d="M19 15l.7 2.2L22 18l-2.3.8L19 21l-.7-2.2L16 18l2.3-.8L19 15z" />
    </svg>
  )
}

export function CaretDown(props) {
  return (
    <svg {...base} width={props.size ?? 14} height={props.size ?? 14} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function Flame(props) {
  return (
    <svg {...base} width={props.size ?? 16} height={props.size ?? 16} aria-hidden="true">
      <path d="M12 22c4.4 0 7-2.8 7-6.5 0-3-2-5-3-7-.3 1.8-1.2 2.8-2 3.5.3-2.6-.7-5.3-3-7-.5 2.5-1.8 4-3.3 5.7C6.3 12 5 13.7 5 15.5 5 19.2 7.6 22 12 22z" />
    </svg>
  )
}

export function Droplet(props) {
  return (
    <svg {...base} width={props.size ?? 17} height={props.size ?? 17} aria-hidden="true">
      <path d="M12 3c3.5 4.2 6 7.6 6 10.8a6 6 0 1 1-12 0C6 10.6 8.5 7.2 12 3z" />
    </svg>
  )
}

export function Check(props) {
  return (
    <svg {...base} width={props.size ?? 14} height={props.size ?? 14} aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}
