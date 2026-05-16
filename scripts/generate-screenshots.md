# App Store Screenshot Generation

Generate five 6.7-inch iPhone screenshots for App Store Connect.

Required device size:

- iPhone 6.7-inch display
- Pixel size: `1290x2796`
- Count: 5 screenshots
- Format: PNG

Use the Split Second color scheme:

- Background: `#0F0E17`
- Primary: `#7F5AF0`
- Accent: `#00C4FF`

## Screenshot Set

1. Onboarding
   - Show the first-run welcome screen.
   - Emphasize the Split Second name, short personality-game value proposition, and primary start action.

2. Daily Question
   - Show an active daily question with two clear answer choices.
   - Include progress, timer or daily status if available, and the dark neon visual style.

3. Results
   - Show post-answer results with percentage split, selected choice, and a concise insight.
   - Make the result state obvious without needing explanatory overlay text.

4. Friends Leaderboard
   - Show friend rankings, avatars or initials, streaks, and score movement.
   - Use realistic names and varied scores.

5. Personality Match
   - Show a match or compatibility screen with a friend.
   - Include a match percentage, shared traits, and a call to compare more answers.

## Capture Workflow

1. Build or run the app locally with the production-like configuration.
2. Use an iPhone 15 Pro Max or equivalent 6.7-inch simulator.
3. Navigate to each state above using seeded test data.
4. Capture screenshots at `1290x2796`.
5. Save final files as:
   - `app-store/screenshots/01-onboarding.png`
   - `app-store/screenshots/02-daily-question.png`
   - `app-store/screenshots/03-results.png`
   - `app-store/screenshots/04-friends-leaderboard.png`
   - `app-store/screenshots/05-personality-match.png`

## Placeholder Generator

The script below generates App Store-sized placeholder PNGs from HTML using Python Playwright. Use these only as layout placeholders until real simulator screenshots are captured.

### Setup

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
mkdir -p app-store/screenshots
python3 scripts/generate-placeholder-screenshots.py
```

### `scripts/generate-placeholder-screenshots.py`

```python
#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR = Path("app-store/screenshots")
OUT_DIR.mkdir(parents=True, exist_ok=True)

COLORS = {
    "bg": "#0F0E17",
    "primary": "#7F5AF0",
    "accent": "#00C4FF",
    "text": "#FFFFFE",
    "muted": "#A7A9BE",
}

SHOTS = [
    {
        "file": "01-onboarding.png",
        "title": "Split Second",
        "eyebrow": "Daily personality game",
        "body": "Answer fast. Compare with friends. Discover what your instincts say about you.",
        "visual": "START",
    },
    {
        "file": "02-daily-question.png",
        "title": "Would you rather...",
        "eyebrow": "Today's question",
        "body": "Know every secret for one day or forget one painful memory forever?",
        "visual": "A / B",
    },
    {
        "file": "03-results.png",
        "title": "Your result",
        "eyebrow": "62% chose your answer",
        "body": "You matched the bold majority. Your friends split closer than expected.",
        "visual": "62%",
    },
    {
        "file": "04-friends-leaderboard.png",
        "title": "Friends",
        "eyebrow": "Weekly leaderboard",
        "body": "Mina 940 pts\nDeniz 910 pts\nAlex 875 pts\nYou 860 pts",
        "visual": "#4",
    },
    {
        "file": "05-personality-match.png",
        "title": "Personality match",
        "eyebrow": "You and Mina are 87% aligned",
        "body": "Shared traits: decisive, curious, competitive. Compare more answers to improve the match.",
        "visual": "87%",
    },
]


def html(shot):
    body = shot["body"].replace("\n", "<br />")
    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        width: 1290px;
        height: 2796px;
        background: {COLORS["bg"]};
        color: {COLORS["text"]};
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
      }
      .screen {
        position: relative;
        width: 1290px;
        height: 2796px;
        overflow: hidden;
        padding: 220px 112px;
      }
      .glow {
        position: absolute;
        inset: 500px auto auto 680px;
        width: 720px;
        height: 720px;
        border-radius: 50%;
        background: radial-gradient(circle, {COLORS["primary"]} 0%, rgba(127,90,240,0.18) 45%, transparent 70%);
        filter: blur(8px);
      }
      .accent {
        position: absolute;
        left: -170px;
        bottom: 360px;
        width: 520px;
        height: 520px;
        border-radius: 50%;
        background: radial-gradient(circle, {COLORS["accent"]} 0%, rgba(0,196,255,0.12) 48%, transparent 72%);
      }
      .phone-bar {
        position: absolute;
        top: 72px;
        left: 50%;
        width: 420px;
        height: 44px;
        transform: translateX(-50%);
        border-radius: 24px;
        background: rgba(255,255,255,0.12);
      }
      .content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .eyebrow {
        color: {COLORS["accent"]};
        font-size: 42px;
        font-weight: 700;
        margin: 0 0 36px;
      }
      h1 {
        margin: 0;
        font-size: 126px;
        line-height: 1.02;
        letter-spacing: 0;
      }
      .body {
        margin-top: 56px;
        color: {COLORS["muted"]};
        font-size: 48px;
        line-height: 1.34;
      }
      .hero {
        width: 100%;
        min-height: 860px;
        border: 2px solid rgba(255,255,255,0.14);
        border-radius: 56px;
        background: linear-gradient(145deg, rgba(127,90,240,0.28), rgba(27,25,40,0.94));
        display: grid;
        place-items: center;
        box-shadow: 0 50px 120px rgba(0,0,0,0.36);
      }
      .visual {
        color: {COLORS["text"]};
        font-size: 168px;
        font-weight: 800;
        text-align: center;
        text-shadow: 0 0 42px rgba(0,196,255,0.5);
      }
      .cta {
        width: 100%;
        height: 116px;
        border-radius: 32px;
        background: {COLORS["primary"]};
        display: grid;
        place-items: center;
        font-size: 38px;
        font-weight: 800;
      }
    </style>
  </head>
  <body>
    <main class="screen">
      <div class="phone-bar"></div>
      <div class="glow"></div>
      <div class="accent"></div>
      <section class="content">
        <div>
          <p class="eyebrow">{shot["eyebrow"]}</p>
          <h1>{shot["title"]}</h1>
          <p class="body">{body}</p>
        </div>
        <div class="hero"><div class="visual">{shot["visual"]}</div></div>
        <div class="cta">Continue</div>
      </section>
    </main>
  </body>
</html>"""


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1290, "height": 2796}, device_scale_factor=1)

    for shot in SHOTS:
        page.set_content(html(shot), wait_until="networkidle")
        page.screenshot(path=str(OUT_DIR / shot["file"]), full_page=False)

    browser.close()
```
