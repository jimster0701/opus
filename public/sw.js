// @ts-ignore
if (!self.define) {
  // @ts-ignore
  let e,
    n = {};
  // @ts-ignore
  const s = (s, i) => (
    (s = new URL(s + ".js", i).href),
    // @ts-ignore
    n[s] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = n), document.head.appendChild(e);
          // @ts-ignore
        } else (e = s), importScripts(s), n();
      }).then(() => {
        // @ts-ignore
        let e = n[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  // @ts-ignore
  self.define = (i, t) => {
    const a =
      // @ts-ignore
      e ||
      // @ts-ignore
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    // @ts-ignore
    if (n[a]) return;
    let c = {};
    // @ts-ignore
    const r = (e) => s(e, a),
      o = { module: { uri: a }, exports: c, require: r };
    // @ts-ignore
    n[a] = Promise.all(i.map((e) => o[e] || r(e))).then((e) => (t(...e), c));
  };
}
// @ts-ignore
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  // @ts-ignore
  importScripts(),
    // @ts-ignore
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "9ce6ec51cbf648fba91f300dbb02ba81",
        },
        {
          url: "/_next/static/chunks/256-2f2c73daf8dbfe0a.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/341.056900400c7cb71c.js",
          revision: "056900400c7cb71c",
        },
        {
          url: "/_next/static/chunks/362-e0a7c5096bac5935.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/435-ffe74ce856140cd1.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/472.a3826d29d6854395.js",
          revision: "a3826d29d6854395",
        },
        {
          url: "/_next/static/chunks/4bd1b696-45d29fb2282d411f.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/566-e3122b053d791ce6.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/616-ab421334fcd84648.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/619-5a33047e473b78cb.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/684-4ae2cf305290d022.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-e5a85eb915020d35.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-e98e6f8f298c1a82.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/api/cld-delete-image/route-23eb56d2903c7e2a.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/api/openai/%5BtaskGen%5D/route-9417784338c16957.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/api/trpc/%5Btrpc%5D/route-8c68b9777391148c.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/create/page-5c813c5d1574b7ca.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/discover/page-1b3d25226139b73b.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/friends/%5Bslug%5D/page-206bfb11c1fe1ae6.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/friends/layout-f9352bf769af3bbc.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/friends/page-207491490c42710a.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/layout-de7b7cab125bb1fc.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/page-2e2e451bcc60ebec.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/app/profile/page-3cbf4288202f07ad.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/framework-6d868e9bc95e10d8.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/main-app-ef2d3f6c97ed8fa3.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/main-db8abb24dc866e5f.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/pages/_app-a7abbc7d7c2efb66.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/pages/_error-3e1f003f4d01ac06.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a0750d5a73ad4154.js",
          revision: "nFbI3UIQlQmLz70UUqm6n",
        },
        {
          url: "/_next/static/css/3d43c951f09eb430.css",
          revision: "3d43c951f09eb430",
        },
        {
          url: "/_next/static/css/847fee49a6e84282.css",
          revision: "847fee49a6e84282",
        },
        {
          url: "/_next/static/css/d3dfbe192dc70154.css",
          revision: "d3dfbe192dc70154",
        },
        {
          url: "/_next/static/media/e11418ac562b8ac1-s.p.woff2",
          revision: "0e46e732cced180e3a2c7285100f27d4",
        },
        {
          url: "/_next/static/nFbI3UIQlQmLz70UUqm6n/_buildManifest.js",
          revision: "2bdbb194a8b61afdde77c42c36f4e0a8",
        },
        {
          url: "/_next/static/nFbI3UIQlQmLz70UUqm6n/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/favicon.ico", revision: "f2ca6727d7cda10480d21cf5d302c8e9" },
        {
          url: "/icons/icon-192x192.png",
          revision: "80316418395e9575569dcccb5a9a0245",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "b1497121a8355f4d68bb3560dc857b72",
        },
        {
          url: "/images/bell.png",
          revision: "1c811a1e7ed49a1a4f2bbfeaba703f1f",
        },
        {
          url: "/images/heart-full.png",
          revision: "11c3f8375ea7f41541fbc3bd9ac88347",
        },
        {
          url: "/images/heart.png",
          revision: "bed171f38bc538c188efa49f41318255",
        },
        {
          url: "/images/pen.png",
          revision: "8fe032686126392121a7d109c083e152",
        },
        {
          url: "/images/setting.png",
          revision: "f44035663044a853be570b1e75288f6b",
        },
        { url: "/manifest.json", revision: "6c59fd883ad26c0872d76f7e91b56151" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              // @ts-ignore
              response: n,
            }) =>
              n && "opaqueredirect" === n.type
                ? new Response(n.body, {
                    status: 200,
                    statusText: "OK",
                    headers: n.headers,
                  })
                : n,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      // @ts-ignore
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const n = e.pathname;
        return !n.startsWith("/api/auth/") && !!n.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      // @ts-ignore
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      // @ts-ignore
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
