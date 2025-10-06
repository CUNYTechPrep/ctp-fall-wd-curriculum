import { NextRequest, NextResponse } from 'next/server';

let todos: { id: number; text: string; done: boolean }[] = [];
let nextId = 1;

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const todo = { id: nextId++, text, done: false };
  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}
