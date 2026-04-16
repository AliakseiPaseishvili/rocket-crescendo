# video-player feature

Reusable video player component wrapping [video.js](https://videojs.com/). Used anywhere a video needs to be played — currently powering the modal in `FileCard` when a `VIDEO` file is clicked.

## Structure

```
video-player/
  components/
    VideoPlayer.tsx             # Client component: video.js player lifecycle, src/poster updates
    index.ts                    # Barrel export for components
  index.ts                      # Barrel export: VideoPlayer, VideoPlayerProps
```

## Types

| Type | Shape |
|---|---|
| `VideoPlayerProps` | `{ src: string; type?: string; poster?: string; autoplay?: boolean; controls?: boolean; muted?: boolean; loop?: boolean; fluid?: boolean; className?: string }` |

## Key patterns

- **Imperative video.js mount** — video.js cannot be attached to a normal React `<video>` element managed by the VDOM. `VideoPlayer` creates a `<video-js>` element imperatively, appends it to a `<div ref={videoRef}>`, and calls `videojs(videoEl, options)`. The `data-vjs-player` attribute on the wrapper div signals to video.js that it should not add its own outer container.
- **Initialisation effect runs once** — the setup `useEffect` has an empty dependency array intentionally. `src`, `type`, and `poster` are captured at mount only for initial configuration; live changes are handled by separate, targeted effects that call `player.src(...)` and `player.poster(...)` directly on the existing player instance.
- **Disposal on unmount** — the cleanup function in the init effect calls `player.dispose()` and nulls `playerRef.current`. The `isDisposed()` guard in the update effects prevents stale calls after unmount (e.g. when the parent dialog closes and React unmounts `VideoPlayer` while async effects are still pending).
- **`fluid` mode** — defaults to `true`, making the player fill its container width and maintain a 16:9 aspect ratio. Set `fluid={false}` when you need a fixed-size player.
- **`vjs-big-play-centered`** — class added to the `<video-js>` element so the big play button is centred, which is the standard video.js UX.

## How to use in a new location

1. Import `VideoPlayer` from `@/frontend/features/video-player`.
2. Pass a `src` (required) and optionally `type` (default `'video/mp4'`), `poster`, `controls`, `autoplay`, `muted`, `loop`, `fluid`, `className`.
3. Wrap in a container that constrains width — `VideoPlayer` fills 100% of its parent when `fluid` is true.

```tsx
import { VideoPlayer } from '@/frontend/features/video-player';

<VideoPlayer src="https://example.com/video.mp4" controls />
```
