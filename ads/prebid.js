/*
 * Loaded as .../ads/prebid.js so that the URL matches EasyList's
 * "/prebid.$script" rule, which is part of the ruleset Chrome ships to the
 * subresource filter. That makes Chrome tag this file as *ad script*.
 *
 * Chrome tags a frame as an ad ("CreatedByAdScript") only when the script that
 * is *currently executing* at the moment the frame is created is ad script.
 * Having ad script merely somewhere on the call stack (e.g. prebid.js invoking
 * a pbjs.que callback that you wrote) is no longer enough, so the iframes have
 * to be built here, inside this file.
 */
"use strict";

(function () {
  var netCreative = [
    '<html><body style="margin:0;font-family:sans-serif;text-align:center">',
    '<p>Network heavy ad</p>',
    '<scr' + 'ipt>',
    "fetch('https://nbg1-speed.hetzner.com/100MB.bin?' + Date.now(), { mode: 'no-cors' });",
    '</scr' + 'ipt>',
    '</body></html>'
  ].join('\n');

  var cpuCreative = [
    '<html><head><style>',
    'body { margin:0; font-family:sans-serif; text-align:center; }',
    '#ops { font-weight: bold; }',
    '</style></head><body>',
    '<p>CPU heavy ad</p><span id="ops">0</span>',
    '<scr' + 'ipt>',
    'let n = 0;',
    'function spin() {',
    '  const end = performance.now() + 25;',
    '  while (performance.now() < end) { n++; }',
    "  document.getElementById('ops').textContent = n.toLocaleString();",
    '  requestAnimationFrame(spin);',
    '}',
    'spin();',
    '</scr' + 'ipt>',
    '</body></html>'
  ].join('\n');

  // The iframe must be created *by this file* for Chrome to tag it as an ad.
  function renderCreative(slotId, creative) {
    var slot = document.getElementById(slotId);
    if (!slot) return;
    var frame = document.createElement('iframe');
    frame.srcdoc = creative;
    slot.appendChild(frame);
  }

  window.renderHeavyAds = function () {
    renderCreative('slot-net', netCreative);
    renderCreative('slot-cpu', cpuCreative);
  };
})();
