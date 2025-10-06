'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>About Page (Client Component)</h1>
      <p>This page demonstrates a client component with state.</p>
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
    </div>
  );
}
