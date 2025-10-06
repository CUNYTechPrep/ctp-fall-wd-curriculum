'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Todo = { id: number; text: string; done: boolean };

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetch(`/api/todos/${id}`)
      .then(res => res.json())
      .then(setTodo);
  }, [id]);

  async function toggleDone() {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo?.done }),
    });
    setTodo(todo => todo && { ...todo, done: !todo.done });
  }

  async function handleDelete() {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    router.push('/todos');
  }

  if (!todo) return <div>Loading...</div>;

  return (
    <div>
      <h1>Todo Detail</h1>
      <p>
        <b>{todo.text}</b> {todo.done ? '✅' : ''}
      </p>
      <button onClick={toggleDone}>
        Mark as {todo.done ? 'Not Done' : 'Done'}
      </button>
      <button onClick={handleDelete} style={{ marginLeft: 8, color: 'red' }}>
        Delete
      </button>
    </div>
  );
}
