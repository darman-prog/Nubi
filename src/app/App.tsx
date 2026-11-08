import React, { useState } from 'react';

// Estructura raíz de la SPA con navegación accesible y puntos de referencia semánticos (doc 04 §4.2)
export default function App(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<'mapa' | 'pasaporte' | 'diario' | 'ayuda'>('mapa');

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Enlace de salto accesible para usuarios de teclado y lectores de pantalla */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: 100,
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'static';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
        }}
      >
        Saltar al contenido principal
      </a>

      {/* Cabecera superior con título y acceso a Ajustes */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-4)',
          borderBottom: 'var(--card-border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <h1 style={{ fontSize: 'var(--text-xl)', color: 'var(--primary)' }}>
          Nubi y el Archipiélago del Sueño
        </h1>
        <button
          type="button"
          aria-label="Ajustes de la aplicación"
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--text-muted)',
            color: 'var(--text)',
            minHeight: 'var(--min-touch-target)',
          }}
          onClick={() => alert('Ajustes (T-11)')}
        >
          ⚙️ Ajustes
        </button>
      </header>

      {/* Contenido principal según la pestaña activa */}
      <main
        id="main-content"
        style={{
          flex: 1,
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: 'var(--card-border)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-sm)',
            width: '100%',
          }}
        >
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
            ¡Hola! Soy Nubi ☁️✨
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
            Los cimientos de la aplicación en React con TypeScript estricto, Vitest y tokens accesibles
            han quedado montados y listos.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg)',
              color: 'var(--primary)',
              fontWeight: 600,
            }}
          >
            <span>Sección actual:</span>
            <span style={{ textTransform: 'capitalize' }}>{currentTab}</span>
          </div>
        </div>
      </main>

      {/* Barra de navegación inferior móvil accesible (doc 04 §4.2) */}
      <nav
        aria-label="Navegación principal"
        style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-around',
          padding: 'var(--space-2) var(--space-4)',
          backgroundColor: 'var(--surface)',
          borderTop: 'var(--card-border)',
        }}
      >
        {(['mapa', 'pasaporte', 'diario', 'ayuda'] as const).map((tab) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'var(--min-touch-target)',
                minHeight: 'var(--min-touch-target)',
                padding: 'var(--space-2)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 400,
                textTransform: 'capitalize',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              }}
              onClick={() => setCurrentTab(tab)}
            >
              {tab === 'mapa' && '🗺️'}
              {tab === 'pasaporte' && '🛂'}
              {tab === 'diario' && '📖'}
              {tab === 'ayuda' && '🛟'}
              <span style={{ fontSize: 'var(--text-xs)' }}>{tab}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
