'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Todo = { id: number; text: string; done: boolean };

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(setTodos);
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <Link href="/todos/new">Add Todo</Link>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <Link href={`/todos/${todo.id}`}>{todo.text}</Link>
            {todo.done ? ' ✅' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
