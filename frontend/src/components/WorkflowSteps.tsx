import { AgentResponse } from '#/lib/api';
import { ChevronRight } from 'lucide-react';

export interface WorkflowStepsProps {
  result: AgentResponse;
}

export function WorkflowSteps({ result }: WorkflowStepsProps) {
  const { planning, research, execution } = result;
  const allSteps = [
    {
      name: 'Planning',
      description: 'Breaking down your request',
      steps: planning.steps,
      status: 'done',
    },
    {
      name: 'Research',
      description: 'Discovering events',
      steps: [`Found ${research.discovered_events.length} matching events`],
      status: 'done',
    },
    {
      name: 'Execution',
      description: 'Preparing booking',
      steps: [execution.message],
      status: 'current',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Multi-Agent Workflow</h3>

      <div className="space-y-4">
        {allSteps.map((stage, index) => (
          <div key={stage.name}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  stage.status === 'done' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{stage.name}</p>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </div>
            </div>
            <ul className="ml-11 space-y-1">
              {stage.steps.map((step, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
