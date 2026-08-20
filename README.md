# Heavy-Ad Intervention Test Stand

Live demo: https://dimaturishchev.github.io/heavy.html  

![Demo screenshot](screenshot.png)

This repo contains a minimal test page that forces Chrome’s Heavy-Ad Intervention: one iframe exceeds the network limit, the other the CPU limit.

## Stable steps to reproduce

1. Host **heavy.html** somewhere or use the live demo above (if still online).  
2. Create a **new Chrome profile**.  
3. Navigate to **heavy.html** in that profile.  
4. The **network frame** is killed almost immediately.  
5. The **CPU frame** is killed in about 15 seconds in the current implementation (12 July 2025, Chrome 138.0.7204.101).

## How the frames get tagged as ads

Heavy-Ad Intervention only applies to frames Chrome has tagged as ads, so the
demo has to earn that tag. Two things are required:

1. **A script Chrome considers ad script.** `ads/prebid.js` is served from a URL
   that matches EasyList’s `/prebid.$script` rule, which is part of the ruleset
   Chrome ships to its subresource filter. Any file name matching a rule in that
   list works; the `prebid` name just keeps the demo realistic.
2. **The frames must be created by that script itself.** Chrome tags a frame
   `CreatedByAdScript` based on the script that is *currently executing* when the
   frame is created.

Point 2 is what broke the older version of this demo. It loaded prebid.js from a
CDN and created the iframes inside a `pbjs.que.push(...)` callback. That callback
lives in an inline first-party script, so even though prebid (ad script) was on
the call stack, the innermost script was not ad script and the frames were left
untagged — while prebid’s own `__pb_locator__` iframe still showed the `ad` badge.
Verified on Chrome 151: an ad-script-provided function creating the frame is
tagged (sync or via `setTimeout`), but an ad script calling a first-party
callback that creates the frame is not.
