const REPOSITORY = 'rancorder/rancorder.dev';
const API_ROOT = `https://api.github.com/repos/${REPOSITORY}`;
const AI_BRANCH_PREFIXES = ['ai/issue-', 'ai/operator-', 'ai/review-'];
const REQUIRED_GATES = ['Site quality', 'Career Graph Integrity', 'Gemini Review Gate'];

type PullRequest = {
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  head: { ref: string };
};

type IssueComment = {
  issue_url: string;
  body: string | null;
  created_at: string;
};

type WorkflowRun = {
  name: string;
  head_branch: string | null;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
};

export type Mission = {
  number: number;
  title: string;
  branch: string;
  url: string;
  state: 'OPEN' | 'MERGED' | 'CLOSED';
  review: 'PASS' | 'BLOCKED' | 'NOT RECORDED';
  repairAttempts: number;
  repaired: boolean;
  updatedAt: string;
};

export type AiDevTelemetry = {
  available: boolean;
  generatedAt: string;
  totalAiPrs: number;
  reviewedPrs: number;
  reviewPassRate: number | null;
  selfHealAttempts: number;
  selfHealSuccesses: number;
  selfHealSuccessRate: number | null;
  averageRepairAttempts: number | null;
  apiCost: 'NOT TRACKED';
  systemStatus: 'OPERATIONAL' | 'ATTENTION' | 'DATA UNAVAILABLE';
  gateFailures: Array<{ name: string; failures: number }>;
  missions: Mission[];
};

const emptyTelemetry = (): AiDevTelemetry => ({
  available: false,
  generatedAt: new Date().toISOString(),
  totalAiPrs: 0,
  reviewedPrs: 0,
  reviewPassRate: null,
  selfHealAttempts: 0,
  selfHealSuccesses: 0,
  selfHealSuccessRate: null,
  averageRepairAttempts: null,
  apiCost: 'NOT TRACKED',
  systemStatus: 'DATA UNAVAILABLE',
  gateFailures: REQUIRED_GATES.map((name) => ({ name, failures: 0 })),
  missions: [],
});

async function githubJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'rancorder.dev-ai-control-center',
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) throw new Error(`GitHub telemetry request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

const isAiBranch = (branch: string) => AI_BRANCH_PREFIXES.some((prefix) => branch.startsWith(prefix));
const issueNumber = (url: string) => Number(url.split('/').pop());

export async function getAiDevTelemetry(): Promise<AiDevTelemetry> {
  try {
    const [pulls, comments, actions] = await Promise.all([
      githubJson<PullRequest[]>('/pulls?state=all&sort=updated&direction=desc&per_page=100'),
      githubJson<IssueComment[]>('/issues/comments?sort=created&direction=desc&per_page=100'),
      githubJson<{ workflow_runs: WorkflowRun[] }>('/actions/runs?per_page=100'),
    ]);

    const aiPulls = pulls.filter((pull) => isAiBranch(pull.head.ref));
    const commentsByPr = new Map<number, IssueComment[]>();
    comments.forEach((comment) => {
      const number = issueNumber(comment.issue_url);
      const list = commentsByPr.get(number) ?? [];
      list.push(comment);
      commentsByPr.set(number, list);
    });

    const missions = aiPulls.map<Mission>((pull) => {
      const prComments = commentsByPr.get(pull.number) ?? [];
      const review = prComments.find((comment) => comment.body?.includes('<!-- gemini-review-gate -->'));
      const attempts = prComments.filter((comment) => comment.body?.includes('<!-- gemini-self-heal-attempt:'));
      const reviewState = review?.body?.includes('VERDICT: PASS')
        ? 'PASS'
        : review?.body?.includes('VERDICT: REQUEST_CHANGES')
          ? 'BLOCKED'
          : 'NOT RECORDED';

      return {
        number: pull.number,
        title: pull.title,
        branch: pull.head.ref,
        url: pull.html_url,
        state: pull.merged_at ? 'MERGED' : pull.state === 'open' ? 'OPEN' : 'CLOSED',
        review: reviewState,
        repairAttempts: attempts.length,
        repaired: attempts.some((comment) => comment.body?.includes('PUSHED')) && reviewState === 'PASS',
        updatedAt: pull.updated_at,
      };
    });

    const reviewed = missions.filter((mission) => mission.review !== 'NOT RECORDED');
    const passed = reviewed.filter((mission) => mission.review === 'PASS').length;
    const repairedMissions = missions.filter((mission) => mission.repairAttempts > 0);
    const selfHealAttempts = repairedMissions.reduce((sum, mission) => sum + mission.repairAttempts, 0);
    const selfHealSuccesses = repairedMissions.filter((mission) => mission.repaired).length;
    const aiRuns = actions.workflow_runs.filter((run) => run.head_branch && isAiBranch(run.head_branch));
    const gateFailures = REQUIRED_GATES.map((name) => ({
      name,
      failures: aiRuns.filter((run) => run.name === name && run.conclusion === 'failure').length,
    }));
    const latestMission = missions[0];
    const latestRequiredRuns = latestMission
      ? REQUIRED_GATES.map((name) => aiRuns.find((run) => run.head_branch === latestMission.branch && run.name === name))
      : [];
    const latestMissionHealthy = latestMission?.review === 'PASS'
      && latestRequiredRuns.every((run) => run?.status === 'completed' && run.conclusion === 'success');

    return {
      available: true,
      generatedAt: new Date().toISOString(),
      totalAiPrs: missions.length,
      reviewedPrs: reviewed.length,
      reviewPassRate: reviewed.length ? Math.round((passed / reviewed.length) * 100) : null,
      selfHealAttempts,
      selfHealSuccesses,
      selfHealSuccessRate: repairedMissions.length
        ? Math.round((selfHealSuccesses / repairedMissions.length) * 100)
        : null,
      averageRepairAttempts: repairedMissions.length
        ? Number((selfHealAttempts / repairedMissions.length).toFixed(1))
        : null,
      apiCost: 'NOT TRACKED',
      systemStatus: latestMissionHealthy ? 'OPERATIONAL' : 'ATTENTION',
      gateFailures,
      missions: missions.slice(0, 8),
    };
  } catch (error) {
    console.error('AI Development Control Center telemetry unavailable', error);
    return emptyTelemetry();
  }
}
