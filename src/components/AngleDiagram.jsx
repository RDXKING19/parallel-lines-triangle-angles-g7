import React from 'react';

// Two parallel lines cut by a transversal, with the given angle marked and
// the "target" angle position highlighted depending on the relationship
// being tested (corresponding / alternate / co-interior / vertical).
function ParallelLineDiagram({ mode, given, size }) {
  const y1 = 55;
  const y2 = 145;
  const cx = 100;
  // Transversal slanted line
  const tx1 = 40, ty1 = 15, tx2 = 160, ty2 = 185;

  const labelPositions = {
    corresponding: { given: { x: 66, y: 40 }, target: { x: 66, y: 130 }, targetText: '?' },
    alternate: { given: { x: 132, y: 40 }, target: { x: 66, y: 160 }, targetText: '?' },
    coInterior: { given: { x: 132, y: 40 }, target: { x: 132, y: 160 }, targetText: '?' },
    vertical: { given: { x: 66, y: 40 }, target: { x: 132, y: 70 }, targetText: '?' }
  };
  const pos = labelPositions[mode] || labelPositions.corresponding;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className="drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
      {/* Parallel line arrows */}
      <line x1="15" y1={y1} x2="185" y2={y1} stroke="#38bdf8" strokeWidth="4" />
      <line x1="15" y1={y2} x2="185" y2={y2} stroke="#38bdf8" strokeWidth="4" />
      {/* Parallel tick marks */}
      <g stroke="#38bdf8" strokeWidth="3">
        <line x1="172" y1={y1 - 5} x2="178" y2={y1 + 5} />
        <line x1="172" y1={y2 - 5} x2="178" y2={y2 + 5} />
      </g>
      {/* Transversal */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#facc15" strokeWidth="4" />

      {/* Intersection points */}
      <circle cx={(tx1 + tx2) / 2 - 30} cy={y1} r="3.5" fill="#fff" />
      <circle cx={(tx1 + tx2) / 2 + 30} cy={y2} r="3.5" fill="#fff" />

      {/* Given angle label */}
      <rect x={pos.given.x - 24} y={pos.given.y - 16} width="48" height="24" rx="8" fill="#0c0520" stroke="#facc15" strokeWidth="1.5" />
      <text x={pos.given.x} y={pos.given.y} fill="#facc15" fontSize="15" fontWeight="900" textAnchor="middle">{given}°</text>

      {/* Target angle label */}
      <rect x={pos.target.x - 20} y={pos.target.y - 16} width="40" height="24" rx="8" fill="#0c0520" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x={pos.target.x} y={pos.target.y} fill="#f43f5e" fontSize="15" fontWeight="900" textAnchor="middle">{pos.targetText}</text>
    </svg>
  );
}

function TriangleDiagram({ a, b, c, size, exterior }) {
  const A = { x: 30, y: 165 };
  const B = { x: 170, y: 165 };
  const C = { x: 95, y: 30 };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className="drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(139,92,246,0.15)" stroke="#a78bfa" strokeWidth="4" />

      {exterior && (
        <>
          <line x1={A.x} y1={A.y} x2={A.x - 40} y2={A.y} stroke="#a78bfa" strokeWidth="3" strokeDasharray="4 3" />
          <rect x={A.x - 62} y={A.y - 34} width="44" height="24" rx="8" fill="#0c0520" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x={A.x - 40} y={A.y - 18} fill="#f43f5e" fontSize="14" fontWeight="900" textAnchor="middle">ext°</text>
        </>
      )}

      {/* Angle A */}
      <rect x={A.x - 4} y={A.y - 38} width="46" height="24" rx="8" fill="#0c0520" stroke="#38bdf8" strokeWidth="1.5" />
      <text x={A.x + 19} y={A.y - 22} fill="#38bdf8" fontSize="14" fontWeight="900" textAnchor="middle">{a}°</text>

      {/* Angle B */}
      <rect x={B.x - 42} y={B.y - 38} width="46" height="24" rx="8" fill="#0c0520" stroke="#4ade80" strokeWidth="1.5" />
      <text x={B.x - 19} y={B.y - 22} fill="#4ade80" fontSize="14" fontWeight="900" textAnchor="middle">{b}°</text>

      {/* Angle C */}
      <rect x={C.x - 22} y={C.y + 8} width="44" height="24" rx="8" fill="#0c0520" stroke="#facc15" strokeWidth="1.5" strokeDasharray={c === '?' ? '4 2' : '0'} />
      <text x={C.x} y={C.y + 24} fill="#facc15" fontSize="14" fontWeight="900" textAnchor="middle">{c}{typeof c === 'number' ? '°' : ''}</text>
    </svg>
  );
}

export function AngleDiagram({ diagramData, size = 200 }) {
  if (!diagramData) return null;
  const { mode = 'corresponding' } = diagramData;

  if (mode === 'triangle') {
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <TriangleDiagram a={diagramData.a} b={diagramData.b} c={diagramData.c} size={size} />
      </div>
    );
  }

  if (mode === 'exterior') {
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <TriangleDiagram a={diagramData.a} b={diagramData.b} c={diagramData.ext} size={size} exterior />
      </div>
    );
  }

  if (mode === 'isosceles') {
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <TriangleDiagram a="?" b="?" c={diagramData.apex} size={size} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-2">
      <ParallelLineDiagram mode={mode} given={diagramData.given} size={size} />
    </div>
  );
}
