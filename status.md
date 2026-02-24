📊 STATUS — MVP Marketplace (Snapshot actualizado)

Te dejo el estado consolidado hasta ahora (con lo que avanzamos):

🏗 Plataforma

Next App Router ✔

Tailwind v4 ✔

Arquitectura modular ✔

Component routing por contexto ✔

Deploy pipeline estable (~26s) ✔

📁 Estructura Relevante

src
├── app
│   ├── categorias
│   │   └── [slug]
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers
│   │   └── [slug]
│   │       └── page.tsx
│   ├── robots.ts
│   ├── search
│   │   └── page.tsx
│   └── sitemap.ts
├── assets
│   ├── icons
│   ├── illustrations
│   ├── img
│   │   └── hero
│   └── logo
├── components
│   ├── home
│   ├── layout
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── PositionSentinel.tsx
│   ├── providers
│   ├── sections
│   ├── services
│   └── ui
│       ├── AdvancedSearch.tsx
│       ├── BackgroundAnimation.tsx
│       ├── Dock.tsx
│       ├── Gallery.tsx
│       ├── MobileSearch.tsx
│       ├── SectionTitle.tsx
│       └── ThemeSwitch.tsx
├── constants
├── context
│   ├── ThemeContext.tsx
│   └── UIContext.tsx
├── data
├── hooks
│   ├── useIntersection.ts
│   ├── useIsMobile.ts
│   └── useViewportSize.ts
├── interfaces
├── lib
└── styles

⚡ Performance

Mobile Lighthouse ~92 ✔

Desktop ~90–99 ✔

Carga real < 1s ✔

Base sólida de producto ✔

🔎 Search System

Predictivo agrupado ✔

Normalize robusto ✔

Dropdown contextual ✔

Floating instance ✔

Mobile takeover UX ✔

Umbral ≥3 chars ✔

Eliminado :has() en typing ✔

Estado controlado por class toggle ✔

Limpieza on route change ✔

Focus model simplificado ✔

Pendientes:

useDeferredValue opcional

Indexación futura

Viewport keyboard handling

Estado: Production usable

🧭 Intersection System

Hook reusable ✔

Multi-target ✔

API declarativa ✔

RootMargin dinámico ✔

useViewportHeight ✔

Pendiente:

Parametrizar options por rule

Estado: Arquitectura correcta

📱 Mobile UX Layer

Float takeover ✔

Scroll locking ✔

Overlay adaptado ✔

Safari fixes ✔

Pendiente:

Keyboard viewport polish

Scroll container resize fino

Estado: 90%

🧩 PDP (Provider Profile)

Layout base ✔

Gallery engine avanzado ✔

Related providers ✔

Pendiente:

Lightbox

Video

Map/fullwidth toggle

Estado: Muy avanzado

🎨 UI Kit

CSS tokens centralizados ✔

JSX sin colores hardcodeados ✔

🗺️ Maps

Embed funcional ✔

Pendiente:

API real

Fullscreen

Coordenadas dinámicas

🔐 Auth / API

Plan definido:

JWT desde WP ✔

Google login ✔

Registro Woo base ✔

Pendiente:

Implementación completa

🧠 UI Orchestrator (Estado actual)
Implementado

✅ UIContext global
✅ dockOpen global
✅ mobileSearchOpen global
✅ mobileSearchPeek global
✅ autoSearchSuppressed global
✅ requestMobileSearch(mode)
✅ notifyDockSettled sin timers
✅ pendingSearchMode con ref
✅ Sentinel → peek integrado
✅ Dock → search coordinación sin timer
✅ Animación open sin top-0 ✔
✅ Botón suppress ✔

⚠️ Problema detectado (nuevo)

Search puede cerrar dock por efectos laterales.

Necesario:

👉 Separar autoridad Dock vs Search
👉 Introducir origin en requestMobileSearch
👉 Dock open debe cerrar search siempre

Estado: En refactor conceptual

🎯 Filosofía Arquitectónica

Un solo punto de entrada para eventos compartidos

Flotantes fuera del layout estructural

Componentes visuales “weones”

Orquestador inteligente

Evitar edge-cases

Coreografía limpia

🧩 Sentinel System (actual)

Sentinels definidos por vista ✔

data-grid-sentinel implementado ✔

Rules configurables ✔

Peek funcional ✔

🧪 Próximos pasos inmediatos

Refactor autoridad Dock vs Search

Recuperar funcionalidades internas ProvidersSearch

UX suppress explícito

Botón lateral (“pelotita”) opcional

Tap afuera (decidir)

📌 Nota de montaje

Flotantes renderizados desde:

LayoutShell dentro de app/layout.tsx

Scroll listener:

Centralizado en orquestador / no en Dock