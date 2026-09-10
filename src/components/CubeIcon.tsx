interface CubeIconProps {
  className?: string;
}

/**
 * Wireframe cube mark used across the product in place of arrow glyphs.
 * Drawn with currentColor so it adapts to light and dark surfaces.
 */
export function CubeIcon({ className = "w-3.5 h-3.5" }: CubeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 8.2 11 4l9.5 4.4-7.5 4.2z" />
      <path d="M3.5 8.2v7.3L13 20v-7.4z" />
      <path d="M20.5 8.4v7.2L13 20" />
      <path d="M7.4 15.1v1.7M10.3 16.4v1.7" />
    </svg>
  );
}

export default CubeIcon;
