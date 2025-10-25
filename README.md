# yt-flux

Little program that interacts with the Miniflux api to download youtube videos semi-automatically

## Usage

This program consists of two parts — one turning your subscriptions into an opml file for Miniflux, and one for interacting with its api to download videos.

### Instructions

Please install node or deno before running.

1. Replace my `lib/subscriptions.csv` with yours (or don't if you're feeling <small>adventurous</small>)
1. Run `pnpm i`
1. Run `./scripts/to_opml`
1. Install Miniflux (with Docker) if you haven't yet
1. Import the newly-generated `dist/feeds.opml` into Miniflux (Feeds -> Import -> Choose File, then Import)

## Resources

-   https://charlesthomas.dev/blog/converting-my-youtube-subscriptions-to-rss-2025-03-01/
-   https://blog.amen6.com/blog/2025/01/no-shorts-please-hidden-youtube-rss-feed-urls/

> Now that I'm writing this I discovered I reinveted the wheel — the first url links to a file that does exactly what I've done :see_no_evil: Oh well, I'm carrying on since there's more to this program than that

## Footnotes

1. I'd say "an opml file", as opposed to "a dot opml file". When reading this file out loud I really was going insane and sounding like Jeremy Clarkson — [an book](https://www.youtube.com/watch?v=mJUtMEJdvqM)
