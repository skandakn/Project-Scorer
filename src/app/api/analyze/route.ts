import { NextRequest, NextResponse } from 'next/server';
import { runFullProjectAnalysis } from '@/lib/analysis/projectAnalyzer';
import { ProjectData } from '@/lib/types';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const project: ProjectData = await req.json();

    if (!project.name || !project.problemStatement || !project.description) {
      return NextResponse.json(
        { error: 'Project name, problem statement, and description are required.' },
        { status: 400 }
      );
    }

    const evaluation = await runFullProjectAnalysis(project);

    // Save to Database if Prisma is connected
    try {
      await prisma.project.upsert({
        where: { id: project.id },
        update: {
          name: project.name,
          tagline: project.tagline,
          category: project.category,
          hackathonName: project.hackathonName,
          hackathonTheme: project.hackathonTheme,
          problemStatement: project.problemStatement,
          targetUsers: project.targetUsers,
          description: project.description,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          videoUrl: project.videoUrl,
          figmaUrl: project.figmaUrl,
          presentationUrl: project.presentationUrl,
          frontendTech: JSON.stringify(project.frontendTech),
          backendTech: JSON.stringify(project.backendTech),
          databaseTech: JSON.stringify(project.databaseTech),
          apisTech: JSON.stringify(project.apisTech),
          aiModelsTech: JSON.stringify(project.aiModelsTech),
          cloudTech: JSON.stringify(project.cloudTech),
          authTech: JSON.stringify(project.authTech),
          integrationsTech: JSON.stringify(project.integrationsTech),
          version: project.version,
          status: 'EVALUATED',
        },
        create: {
          id: project.id,
          name: project.name,
          tagline: project.tagline,
          category: project.category,
          hackathonName: project.hackathonName,
          hackathonTheme: project.hackathonTheme,
          problemStatement: project.problemStatement,
          targetUsers: project.targetUsers,
          description: project.description,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          videoUrl: project.videoUrl,
          figmaUrl: project.figmaUrl,
          presentationUrl: project.presentationUrl,
          frontendTech: JSON.stringify(project.frontendTech),
          backendTech: JSON.stringify(project.backendTech),
          databaseTech: JSON.stringify(project.databaseTech),
          apisTech: JSON.stringify(project.apisTech),
          aiModelsTech: JSON.stringify(project.aiModelsTech),
          cloudTech: JSON.stringify(project.cloudTech),
          authTech: JSON.stringify(project.authTech),
          integrationsTech: JSON.stringify(project.integrationsTech),
          version: project.version,
          status: 'EVALUATED',
        },
      });

      await prisma.evaluation.create({
        data: {
          id: evaluation.id,
          projectId: project.id,
          overallScore: evaluation.overallScore,
          readinessLevel: evaluation.readinessLevel,
          summary: evaluation.summary,
          strengths: JSON.stringify(evaluation.strengths),
          weaknesses: JSON.stringify(evaluation.criticalWeaknesses),
          quickWins: JSON.stringify(evaluation.quickWins),
          technicalAudit: JSON.stringify(evaluation.technicalAudit),
          uiAudit: JSON.stringify(evaluation.uiAudit),
          ideaAudit: JSON.stringify(evaluation.ideaAnalysis),
          judgeObjections: JSON.stringify(evaluation.judgeObjections),
        },
      });
    } catch {
      // Prisma write error handled gracefully; return evaluation result
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
