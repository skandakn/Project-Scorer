import { NextRequest, NextResponse } from 'next/server';
import { generatePitches } from '@/lib/analysis/pitchAnalyzer';
import { PitchTone, ProjectData } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { project, tone }: { project: ProjectData; tone?: PitchTone } = await req.json();

    if (!project) {
      return NextResponse.json({ error: 'Project data is required' }, { status: 400 });
    }

    const pitches = generatePitches(project, tone || 'Judge-focused');
    return NextResponse.json({ success: true, pitches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Pitch generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
