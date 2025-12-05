// Village background for the NIRD-themed RPG game
// Inspired by a Gaulish village resisting digital imperialism

interface VillageBackgroundProps {
  width: number;
  height: number;
}

export function VillageBackground({ width, height }: VillageBackgroundProps) {
  if (width === 0 || height === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      {/* Base grass layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              #2d5a27 0%,
              #3d6b33 30%,
              #4a7c3f 60%,
              #3d6b33 100%
            )
          `,
        }}
      />

      {/* Grass texture pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, #5a9b4a 1px, transparent 1px),
            radial-gradient(circle at 30% 40%, #4a8b3a 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, #5a9b4a 1px, transparent 1px),
            radial-gradient(circle at 70% 30%, #4a8b3a 1px, transparent 1px),
            radial-gradient(circle at 90% 70%, #5a9b4a 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Dirt paths - crossing pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-80">
        {/* Main horizontal path */}
        <rect
          x="0"
          y={height / 2 - 20}
          width={width}
          height="40"
          fill="#8B7355"
        />
        <rect
          x="0"
          y={height / 2 - 18}
          width={width}
          height="36"
          fill="#9C8565"
        />

        {/* Main vertical path */}
        <rect
          x={width / 2 - 20}
          y="0"
          width="40"
          height={height}
          fill="#8B7355"
        />
        <rect
          x={width / 2 - 18}
          y="0"
          width="36"
          height={height}
          fill="#9C8565"
        />

        {/* Path texture dots */}
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={`path-dot-h-${i}`}
            cx={(width / 50) * i + 10}
            cy={height / 2 + (Math.random() - 0.5) * 20}
            r="2"
            fill="#7a6345"
          />
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={`path-dot-v-${i}`}
            cx={width / 2 + (Math.random() - 0.5) * 20}
            cy={(height / 50) * i + 10}
            r="2"
            fill="#7a6345"
          />
        ))}
      </svg>

      {/* Village buildings and decorations */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Top-left hut */}
        <g transform={`translate(${width * 0.08}, ${height * 0.08})`}>
          <PixelHut color="#8B4513" roofColor="#654321" />
        </g>

        {/* Top-right forge */}
        <g transform={`translate(${width * 0.82}, ${height * 0.08})`}>
          <PixelForge />
        </g>

        {/* Bottom-left well */}
        <g transform={`translate(${width * 0.08}, ${height * 0.78})`}>
          <PixelWell />
        </g>

        {/* Bottom-right server hut (datacenter) */}
        <g transform={`translate(${width * 0.82}, ${height * 0.78})`}>
          <PixelServerHut />
        </g>

        {/* Trees scattered around */}
        <g transform={`translate(${width * 0.02}, ${height * 0.35})`}>
          <PixelTree variant="pine" />
        </g>
        <g transform={`translate(${width * 0.92}, ${height * 0.35})`}>
          <PixelTree variant="oak" />
        </g>
        <g transform={`translate(${width * 0.35}, ${height * 0.02})`}>
          <PixelTree variant="pine" />
        </g>
        <g transform={`translate(${width * 0.65}, ${height * 0.02})`}>
          <PixelTree variant="oak" />
        </g>
        <g transform={`translate(${width * 0.35}, ${height * 0.88})`}>
          <PixelTree variant="oak" />
        </g>
        <g transform={`translate(${width * 0.65}, ${height * 0.88})`}>
          <PixelTree variant="pine" />
        </g>

        {/* Decorative flowers */}
        {[
          { x: 0.15, y: 0.4 },
          { x: 0.25, y: 0.15 },
          { x: 0.75, y: 0.15 },
          { x: 0.85, y: 0.4 },
          { x: 0.15, y: 0.6 },
          { x: 0.85, y: 0.6 },
          { x: 0.25, y: 0.85 },
          { x: 0.75, y: 0.85 },
        ].map((pos, i) => (
          <g key={`flower-${i}`} transform={`translate(${width * pos.x}, ${height * pos.y})`}>
            <PixelFlower color={i % 2 === 0 ? '#ff6b6b' : '#ffd700'} />
          </g>
        ))}

        {/* Rocks/boulders */}
        <g transform={`translate(${width * 0.2}, ${height * 0.55})`}>
          <PixelRock />
        </g>
        <g transform={`translate(${width * 0.8}, ${height * 0.45})`}>
          <PixelRock />
        </g>

        {/* Village sign in center */}
        <g transform={`translate(${width * 0.5 - 30}, ${height * 0.5 - 50})`}>
          <PixelSign text="NIRD" />
        </g>
      </svg>

      {/* Ambient light overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%,
              rgba(255, 215, 0, 0.1) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* Border fence */}
      <div className="absolute inset-2 border-4 border-[#8B4513]/30 pointer-events-none" />
      <div className="absolute inset-3 border-2 border-[#654321]/20 pointer-events-none" />
    </div>
  );
}

// Pixel art components
function PixelHut({ color, roofColor }: { color: string; roofColor: string }) {
  return (
    <svg width="60" height="50" viewBox="0 0 60 50" style={{ imageRendering: 'pixelated' }}>
      {/* Roof */}
      <polygon points="30,0 60,20 0,20" fill={roofColor} />
      <polygon points="30,2 55,18 5,18" fill="#5a3a1a" />

      {/* Walls */}
      <rect x="8" y="20" width="44" height="28" fill={color} />
      <rect x="10" y="22" width="40" height="24" fill="#9a6a3a" />

      {/* Door */}
      <rect x="24" y="30" width="12" height="18" fill="#4a2a0a" />
      <rect x="26" y="32" width="8" height="14" fill="#3a1a00" />
      <circle cx="32" cy="40" r="1.5" fill="#ffd700" />

      {/* Window */}
      <rect x="40" y="28" width="8" height="8" fill="#87CEEB" />
      <rect x="43" y="28" width="2" height="8" fill="#4a2a0a" />
      <rect x="40" y="31" width="8" height="2" fill="#4a2a0a" />
    </svg>
  );
}

function PixelForge() {
  return (
    <svg width="60" height="50" viewBox="0 0 60 50" style={{ imageRendering: 'pixelated' }}>
      {/* Chimney with smoke */}
      <rect x="45" y="0" width="8" height="15" fill="#4a4a4a" />
      <circle cx="49" cy="5" r="3" fill="#888" opacity="0.5" />
      <circle cx="52" cy="2" r="2" fill="#aaa" opacity="0.3" />

      {/* Roof */}
      <polygon points="30,5 60,22 0,22" fill="#4a4a4a" />

      {/* Walls */}
      <rect x="5" y="22" width="50" height="26" fill="#3a3a3a" />
      <rect x="7" y="24" width="46" height="22" fill="#5a5a5a" />

      {/* Forge opening (glowing) */}
      <rect x="20" y="30" width="20" height="16" fill="#1a1a1a" />
      <rect x="22" y="32" width="16" height="12" fill="#ff6600" />
      <rect x="24" y="34" width="12" height="8" fill="#ffaa00" />

      {/* Anvil */}
      <rect x="5" y="38" width="12" height="8" fill="#2a2a2a" />
      <rect x="3" y="42" width="16" height="4" fill="#1a1a1a" />
    </svg>
  );
}

function PixelWell() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ imageRendering: 'pixelated' }}>
      {/* Base */}
      <ellipse cx="20" cy="35" rx="18" ry="5" fill="#6a6a6a" />
      <rect x="4" y="15" width="32" height="20" fill="#808080" />

      {/* Stone pattern */}
      <rect x="6" y="17" width="8" height="6" fill="#6a6a6a" />
      <rect x="16" y="17" width="8" height="6" fill="#7a7a7a" />
      <rect x="26" y="17" width="8" height="6" fill="#6a6a6a" />
      <rect x="10" y="25" width="8" height="6" fill="#7a7a7a" />
      <rect x="22" y="25" width="8" height="6" fill="#6a6a6a" />

      {/* Water */}
      <ellipse cx="20" cy="15" rx="14" ry="4" fill="#4a90d9" />

      {/* Roof structure */}
      <rect x="2" y="5" width="3" height="25" fill="#8B4513" />
      <rect x="35" y="5" width="3" height="25" fill="#8B4513" />
      <rect x="2" y="3" width="36" height="4" fill="#654321" />

      {/* Bucket rope */}
      <line x1="20" y1="5" x2="20" y2="12" stroke="#8B4513" strokeWidth="1" />
      <rect x="17" y="10" width="6" height="4" fill="#8B4513" />
    </svg>
  );
}

function PixelServerHut() {
  return (
    <svg width="60" height="50" viewBox="0 0 60 50" style={{ imageRendering: 'pixelated' }}>
      {/* Modern-ish roof */}
      <rect x="0" y="10" width="60" height="5" fill="#4a90d9" />
      <rect x="2" y="12" width="56" height="3" fill="#3a80c9" />

      {/* Walls */}
      <rect x="5" y="15" width="50" height="33" fill="#2a2a3e" />
      <rect x="7" y="17" width="46" height="29" fill="#3a3a4e" />

      {/* Server racks (glowing) */}
      <rect x="10" y="20" width="15" height="22" fill="#1a1a2e" />
      <rect x="12" y="22" width="11" height="3" fill="#22c55e" />
      <rect x="12" y="27" width="11" height="3" fill="#3b82f6" />
      <rect x="12" y="32" width="11" height="3" fill="#22c55e" />
      <rect x="12" y="37" width="11" height="3" fill="#ffd700" />

      <rect x="35" y="20" width="15" height="22" fill="#1a1a2e" />
      <rect x="37" y="22" width="11" height="3" fill="#3b82f6" />
      <rect x="37" y="27" width="11" height="3" fill="#22c55e" />
      <rect x="37" y="32" width="11" height="3" fill="#ffd700" />
      <rect x="37" y="37" width="11" height="3" fill="#22c55e" />

      {/* Blinking lights */}
      <circle cx="23" cy="24" r="1" fill="#00ff00">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="48" cy="29" r="1" fill="#ff0000">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="23" cy="34" r="1" fill="#00ff00">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function PixelTree({ variant = 'pine' }: { variant?: 'pine' | 'oak' }) {
  if (variant === 'pine') {
    return (
      <svg width="30" height="45" viewBox="0 0 30 45" style={{ imageRendering: 'pixelated' }}>
        {/* Trunk */}
        <rect x="12" y="30" width="6" height="15" fill="#8B4513" />
        <rect x="13" y="32" width="4" height="11" fill="#654321" />

        {/* Pine layers */}
        <polygon points="15,0 25,15 5,15" fill="#228B22" />
        <polygon points="15,8 27,22 3,22" fill="#2a9a2a" />
        <polygon points="15,15 30,32 0,32" fill="#228B22" />
      </svg>
    );
  }

  return (
    <svg width="35" height="45" viewBox="0 0 35 45" style={{ imageRendering: 'pixelated' }}>
      {/* Trunk */}
      <rect x="14" y="28" width="7" height="17" fill="#8B4513" />
      <rect x="15" y="30" width="5" height="13" fill="#654321" />

      {/* Oak canopy */}
      <ellipse cx="17.5" cy="18" rx="16" ry="16" fill="#228B22" />
      <ellipse cx="17.5" cy="16" rx="14" ry="14" fill="#2a9a2a" />
      <ellipse cx="15" cy="14" rx="8" ry="8" fill="#3aaa3a" />
      <ellipse cx="22" cy="12" rx="6" ry="6" fill="#2a9a2a" />
    </svg>
  );
}

function PixelFlower({ color }: { color: string }) {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" style={{ imageRendering: 'pixelated' }}>
      {/* Stem */}
      <rect x="4" y="6" width="2" height="6" fill="#228B22" />

      {/* Petals */}
      <rect x="3" y="0" width="4" height="4" fill={color} />
      <rect x="1" y="2" width="4" height="4" fill={color} />
      <rect x="5" y="2" width="4" height="4" fill={color} />
      <rect x="3" y="4" width="4" height="4" fill={color} />

      {/* Center */}
      <rect x="4" y="3" width="2" height="2" fill="#ffd700" />
    </svg>
  );
}

function PixelRock() {
  return (
    <svg width="25" height="18" viewBox="0 0 25 18" style={{ imageRendering: 'pixelated' }}>
      <ellipse cx="12.5" cy="12" rx="12" ry="6" fill="#6a6a6a" />
      <ellipse cx="12.5" cy="10" rx="10" ry="5" fill="#808080" />
      <ellipse cx="10" cy="8" rx="5" ry="3" fill="#9a9a9a" />
    </svg>
  );
}

function PixelSign({ text }: { text: string }) {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" style={{ imageRendering: 'pixelated' }}>
      {/* Post */}
      <rect x="27" y="20" width="6" height="20" fill="#8B4513" />

      {/* Sign board */}
      <rect x="5" y="5" width="50" height="20" fill="#654321" />
      <rect x="7" y="7" width="46" height="16" fill="#8B4513" />

      {/* Text */}
      <text
        x="30"
        y="18"
        textAnchor="middle"
        fill="#ffd700"
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {text}
      </text>

      {/* Decorative nails */}
      <circle cx="10" cy="10" r="1.5" fill="#ffd700" />
      <circle cx="50" cy="10" r="1.5" fill="#ffd700" />
      <circle cx="10" cy="20" r="1.5" fill="#ffd700" />
      <circle cx="50" cy="20" r="1.5" fill="#ffd700" />
    </svg>
  );
}
