import { NextRequest, NextResponse } from 'next/server';
import { evaluateMockAnswer } from '@/lib/analysis/judgeSimulator';
import { JudgeObjection } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { question, answer }: { question: JudgeObjection; answer: string } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const evaluation = evaluateMockAnswer(question, answer);
    return NextResponse.json(evaluation);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Evaluation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
