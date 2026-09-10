import cubeAsset from "../assets/figma/cube-dark.png.asset.json";

interface CubeIconProps {
  className?: string;
}

/**
 * Wireframe cube mark used across the product in place of arrow glyphs.
 * Drawn with currentColor so it adapts to light and dark surfaces.
 */
export function CubeIcon({ className = "w-3.5 h-3.5" }: CubeIconProps) {
  return <img src={cubeAsset.url} alt="" className={`object-contain ${className}`} aria-hidden="true" />;
}

export default CubeIcon;
