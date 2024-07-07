import { notFound } from 'next/navigation';

// This is required for Route Group scenario, i.e., not-found.tsx under folder with brackets like [locale]
// Please refer to this dicussion: https://github.com/vercel/next.js/discussions/50034

export default function NotFoundDummy() {
  notFound();
}
