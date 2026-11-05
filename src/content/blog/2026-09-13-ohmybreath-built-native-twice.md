---
title: "OhMyBreath: one breathing trainer, built native twice"
description: "A breathing coach for macOS and Windows, SwiftUI on one side, Electron on the other, with 3D projection, zero UI frameworks and zero audio files."
date: 2026-09-13
tags: [swift, swiftui, electron, typescript, desktop]
stack: [Swift, SwiftUI, TypeScript, Electron]
draft: false
---

I wanted to build a desktop breathing coach that makes it easy to relax and
focus. Just choose a breathing technique, such as 5–5 cardiac coherence, Navy
SEAL box breathing or the 4–7–8 method, close your eyes and follow the guided
exercise. The protocols and the physiology come from a medical manual by Dr.
Claudio G. Gallo (*"I superpoteri del respiro"*, 2026); the rest, as
architecture, animation, audio synthesis, packaging, is what I built. It is
deliberately local-first: no backend, no account, no telemetry, history stays
on the device.

Then came the decision that shaped the whole project: **build it native,
twice**, SwiftUI on macOS and TypeScript with Electron on Windows instead of
one cross-platform codebase.

## Native twice instead of cross-platform once

A single codebase would have shipped faster. But each platform got an
implementation the way that platform expects: SwiftUI with a menu-bar
companion and power-management APIs on macOS; a web-tech renderer with a
custom frameless titlebar on Windows. The session engine — the state machine
driving inhale / hold / exhale — exists twice, in Swift and in TypeScript,
kept deliberately identical.

The clinical content exists exactly once: a structured JSON catalog is the
single source of truth for protocols, mechanisms and contraindications,
mirrored into both apps, so medical content can be reviewed without touching
application code on either side.

```json
{
  "id": "box-breathing",
  "name": "Navy SEAL box breathing",
  "phases": [
    { "label": "inhale", "seconds": 4 },
    { "label": "hold", "seconds": 4 },
    { "label": "exhale", "seconds": 4 },
    { "label": "hold", "seconds": 4 }
  ],
  "tags": ["#focus", "#stress"]
}
```

## No 3D engine, no audio files

The animated torso, the part that shows *where* the breath should go, is a
mathematical model drawn with 2D canvas primitives: elliptical rib rings, a
parabolic diaphragm dome, hand-rolled yaw/pitch/perspective projection. No
WebGL, no Three.js, no model downloads, no GPU requirement. The rib expansion
follows real mechanics (+22% lateral bucket-handle, +30% sagittal
pump-handle) and the diaphragm actively descends on inhale; physiology
drives the animation.

Sound follows the same rule. Every soundscape, Tibetan singing bowls, Zen
bells, solfeggio tones, ocean noise, is synthesized at runtime from
oscillators, gain envelopes and biquad filters. No audio assets shipped, so
installers stay small, tempo and pitch are programmable per breathing phase.

## Small details that make a difference

- The Electron app is secure by default, with Node integration disabled,
  context isolation enabled, a sandboxed preload script and only six IPC
  channels exposed for window controls.
- A single `VERSION` file keeps all manifests in sync through a simple bump
  script, making builds consistent and reproducible from a clean checkout.
- The macOS app supports both Intel and Apple Silicon, while Windows
  installers are built directly from macOS, including ARM64 versions.
