import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { message: "Password reset is not enabled on this deployment." },
    { status: 503 }
  );
}
