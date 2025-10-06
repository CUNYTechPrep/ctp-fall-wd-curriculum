'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTodoPage() {
  const [text, setText] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    router.push('/todos');
  }

  return (
    <div>
      <h1>Add Todo</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What to do?"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
