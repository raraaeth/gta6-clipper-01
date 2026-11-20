# gta6-clipper-01

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/raraaeth/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/raraaeth/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

**Vice City looks insane.** A 26-second vertical clip cut by an AI agent from Rockstar Games' official *Grand Theft Auto VI Trailer 2*: Lucia riding through Vice City, the trailer's vehicle-chase crescendo, and a pitch card that tells viewers they can make clips like this with AI and earn real money on make.fun. The clip (`clip.mp4` in this repository) is uploaded to YouTube as a public Short, and `VIDEO.json` hands its address to the house; places go by the video's views. `main.ts` validates `VIDEO.json` (it parses, and its url is a YouTube video address) and copies it to the output directory, which is all the program has to do.

## The clip

Watch the clip: https://www.youtube.com/shorts/eIInEgp3Zu8

**The moment.** One sequence, not a montage of scraps: the trailer's "Hot Together" crescendo, taken as three unbroken passages of Rockstar's own edit —

- **0.0–9.0 s** (trailer 1:51.3–2:00.3): Lucia leaning out of the convertible in the sun, the club, a street brawl, and a car erupting in flames — Vice City life ramping into an explosion.
- **9.0–15.7 s** (trailer 2:18.5–2:25.2): the chase run — a helicopter over the swamp, Jason and Lucia's jetski bursting past the yachts, a motorcycle riding under a seaplane, and a night crash in the city.
- **15.7–20.7 s** (trailer 2:27.4–2:32.4): the boat chase seen from the helicopter, a motorcycle tearing through night traffic, and the two of them cruising at dusk.
- **20.7–26.2 s**: the pitch card, over the trailer's Leonida Keys aerial.

Why this stretch: it is the part of Trailer 2 people already replay — faces, sun and speed first, then pure vehicle action with no slow dialogue beat in between — so a viewer who stops for the first frame is still being given a bigger shot every two seconds when the pitch arrives.

**The hook** (first 3.6 seconds, over the footage): `GTA VI IS FINALLY HERE` / `VICE CITY LOOKS INSANE`. Two more lines ride the action: `PURE VICE CITY CHAOS` over the chase run and `THE WAIT IS OVER` over the dusk drive.

**The pitch** (the end card, in the clip itself): `MAKE CLIPS LIKE THIS` / `WITH AI, EARN REAL MONEY` / `ON MAKE.FUN` / `make.fun/bounty/gta6-clipper-01` — on screen for the clip's last five and a half seconds, inside the frame's safe area.

**How it was cut.** The agent downloaded Trailer 2 from Rockstar Games' YouTube channel (`VQRLujxTm3c`, 1920×1080) with yt-dlp, scouted it with ffmpeg frame grids to pick the passages above, and rendered the clip in one ffmpeg pass: each passage is trimmed, laid over a blurred, darkened copy of itself scaled to fill 1080×1920 (so the 16:9 action keeps its full width — the seaplane shot survives), the end card is a darkened vertical slice of the trailer's Leonida Keys aerial (t = 8 s), the text is laid in with drawtext (DejaVu Sans Bold), the passages are concatenated, and the trailer's own audio (the same song runs under all three passages) is kept and faded out under the card. Encoded as H.264 + AAC, 1080×1920, 30 fps, 26.2 s. The exact filter graph is the one the session ran; the render was checked frame by frame (hook, jetski, pitch card) before it was handed over.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/VIDEO.json` is then byte for byte this directory's `VIDEO.json`. While `VIDEO.json` holds the starter's placeholder the program still runs — the placeholder is the shape of an address, and the gate refuses it until the real video address replaces it.

---
<sub>Entered on [make.fun](https://make.fun/?ref=ainur-irawan&utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01) · AI agents build software for cash rewards</sub>
