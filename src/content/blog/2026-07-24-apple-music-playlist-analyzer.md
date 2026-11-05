---
title: "A zero-dependency macOS app for Apple Music playlist stats"
description: "How I built a native SwiftUI playlist analyzer that reads the local Music.app library or any public playlist link, with a full CLI mode and no third-party dependencies."
date: 2026-07-24
tags: [swift, swiftui, macos, applescript, music]
stack: [Swift, SwiftUI, AppKit]
repo: https://github.com/silversonicaxel/AppleMusicAnalyzer
draft: false
---

Apple Music gives you no playlist statistics. If you want the genre mix of a
playlist, how diverse its artists are, or which release era dominates it, you
either eyeball it or use a web tool that asks for your Apple credentials. I
listen to music across many playlists, mine or found online. So I wrote one
native tool that analyzes them. No developer token, no OAuth, no library
data leaving the machine.

Paste a public playlist URL or pick one of
your own playlists, and the dashboard shows the genre donut, the decade
timeline, artist diversity, durations, tempo and plus a searchable track
inspector in true playlist order. The same binary is also a CLI:

```bash
# stages compose over JSON — fetch, analyze, or both in one shot
analyzer fetch --playlist https://music.apple.com/... --output tracks.json
analyzer analyze --input tracks.json --output report.json
analyzer pipeline --playlist https://music.apple.com/...
```

## The contract came first

The app is split into a data fetcher, an analytics engine, and the SwiftUI
frontend, connected exclusively by two `Codable` types, a raw
`DataFetcherPayload` in, an `AnalyticsReport` out:

```swift
struct DataFetcherPayload: Codable {
  let playlist: Playlist
  let tracks: [RawTrack]
}

struct AnalyticsReport: Codable {
  let genreBreakdown: [GenreSlice]
  let decades: [DecadeBucket]
  let artistDiversity: Diversity
}
```

I separated the core logic from the UI right from the start, before building
any screens. That decision quickly proved its value: the analytics engine
runs independently, the CLI tools could be built on top of it with very
little extra work, and older exported JSON files remain compatible with
newer versions thanks to backward-compatible decoding.

## Two sources, one payload

- **Local library**: an AppleScript fetcher drives `osascript` to query the
  Music app directly (`name of tracks of playlist ...`). No MusicKit
  entitlement, no sandbox profile, no authentication: it reads exactly what I
  already see in Music.app.
- **Public links**: a web fetcher scrapes the playlist page for the
  `<meta property="music:song">` tags (song IDs, in playlist order), then
  batch-resolves metadata through the iTunes Lookup API, free, keyless.

Both emit the same payload, so everything downstream is source-agnostic, and
the router falls back from web to local (and back) when one path fails.

Web scraping is fragile, so the web path never depends on a single strategy:
if the lookup API fails, it falls back to the page's JSON-LD blocks; if those
are missing, to a regex pass over Apple's embedded script data. Each fallback
loses a little fidelity — genre, duration — but still returns a complete,
ordered track list.

## Zero dependencies

All metrics are calculated from scratch in around 300 lines of pure Swift,
with no external libraries. This includes a genre system that groups around
60 different genre labels into 12 main categories (for example, Trap, Drill
and Boom Bap are all grouped under Hip-Hop / Rap), year extraction and decade
grouping, artist diversity measurements, and duration and tempo analysis.

The donut chart and decade timeline are also built from scratch using
SwiftUI's `Path` and `Shape`. Since there are only two charts, having full
control over their appearance was more useful than bringing in an external
charting library. SwiftUI's Animatable support also makes the transitions
straightforward to implement.

The same executable serves two purposes. Run it without arguments and it
opens the desktop dashboard in an NSWindow. Pass commands such as fetch,
analyze or pipeline, and it works like a traditional Unix command-line tool.
The dashboard also includes a custom main menu to support standard keyboard
shortcuts such as `⌘C`, `⌘V` and `⌘A`.

The entire project relies exclusively on Apple's SDKs. It builds in seconds,
has no third-party dependencies to maintain and avoids unexpected
compatibility issues when external libraries release new versions.
