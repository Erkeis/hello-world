// [Intent] Provides a structural scaffold for the 12 containers in a 4x3 grid (2026-04-16)
import React from 'react';

const ContainerGrid: React.FC = () => {
  const containers = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Container ${i + 1}`,
  }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '1rem',
      padding: '1rem',
      height: '80vh',
      backgroundColor: '#16171d'
    }}>
      {containers.map((container) => (
        <div
          key={container.id}
          style={{
            border: '2px dashed #2e303a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2028',
            color: '#9ca3af'
          }}
        >
          {container.name}
        </div>
      ))}
    </div>
  );
};

export default ContainerGrid;
