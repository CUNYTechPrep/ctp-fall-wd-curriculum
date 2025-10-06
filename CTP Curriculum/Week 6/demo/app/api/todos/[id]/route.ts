import { NextRequest, NextResponse } from 'next/server';

let todos: { id: number; text: string; done: boolean }[] = [];
let nextId = 1;

// Share state with /api/todos/route.ts
if (typeof global !== 'undefined') {
  // @ts-ignore
  if (!global._todos) global._todos = [];
  // @ts-ignore
  if (!global._nextId) global._nextId = 1;
  // @ts-ignore
  todos = global._todos;
  // @ts-ignore
  nextId = global._nextId;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const todo = todos.find(t => t.id === Number(params.id));
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(todo);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idx = todos.findIndex(t => t.id === Number(params.id));
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = await req.json();
  todos[idx] = { ...todos[idx], ...data };
  return NextResponse.json(todos[idx]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idx = todos.findIndex(t => t.id === Number(params.id));
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  todos.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
