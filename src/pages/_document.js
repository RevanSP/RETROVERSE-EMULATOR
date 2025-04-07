import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="lofi">
      <Head>
        <link rel="icon" href="/assets/favicon.avif" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className="antialiased bg-base-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}