import { PinIcon, XIcon } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';

import { netteeRepo } from '../constants/kanban';
import {
  GroupedIssues,
  IssueData,
  KanbanProgress,
  UpsertIssuePayload,
} from '../types/issues';

type SetState<T> = Dispatch<SetStateAction<T>>;

interface ModalProps {
  item: Partial<IssueData>;
  setModal: SetState<Partial<IssueData> | null>;
  setIssues: SetState<GroupedIssues>;
}

export function Modal({ item, setModal, setIssues }: ModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formToggle, setFormToggle] = useState<Record<string, boolean>>({});

  const getRepo = (item: {
    repo?: string;
    project?: string;
    team?: string;
  }) => {
    type ProjectName = keyof typeof netteeRepo;
    type TeamName = keyof (typeof netteeRepo)[ProjectName];

    if (item.repo) return item.repo;
    if (item.project && item.team) {
      return netteeRepo[item.project as ProjectName][item.team as TeamName][0];
    }
    return undefined;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const isNew = item.number === 0;

    const payload = {
      owner: 'nettee-space',
      repo: getRepo(item),
      issue_number: isNew ? undefined : item.number,

      source: 'client',
      action: isNew ? 'create' : 'update',
      issue: {
        title: formData.get('title'),
        body: formData.get('body'),
        assignees: ['revy7289'],
        labels: [],
        progress: item.progress,
      },
    };

    upsertTable(payload);
  };

  const upsertTable = async (payload: UpsertIssuePayload) => {
    try {
      const response = await fetch(
        'https://mvthhkegwhdismekprnz.supabase.co/functions/v1/nettee-function',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-github-event': 'issues',
          },
          body: JSON.stringify(payload),
        }
      );

      const issue = await response.json();
      console.log(issue);

      setIssues((prev) => {
        const updated: GroupedIssues = { ...prev };

        const project = item.project;
        const team = item.team;
        const progress = (item.progress ?? 'TODO') as KanbanProgress;

        if (!project || !team || !progress) return prev; // fallback

        const status: KanbanProgress[] = ['TODO', 'DOING', 'DONE'];
        for (const key of status) {
          updated[project][team][key] = updated[project][team][key].filter(
            (i) => i.number !== issue.data.number
          );
        }

        updated[project][team][progress].unshift(issue.data);

        return updated;
      });

      setModal(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFormToggle((prev) => ({
      ...prev,
      [e.target.name]: false,
    }));
  };

  const handleFormToggle = (key: string) => {
    setFormToggle((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const optionProgress = ['TODO', 'DOING', 'DONE', 'CHECKED'];

  return (
    <div
      className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/50 pr-[20px] pl-[10px]"
      onClick={(e) => e.target === e.currentTarget && setModal(null)}
    >
      <form
        className="flex h-full max-h-[780px] w-full max-w-[1028px] flex-col rounded-[8px] bg-white"
        onSubmit={handleSubmit}
      >
        <div className="flex h-[56px] items-center justify-between rounded-t-[8px] bg-[#EDEDED] p-[16px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[32px] w-[32px] items-center justify-center">
              <PinIcon />
            </div>

            <p className="flex gap-[4px] font-semibold">
              {item.project} <span className="text-[12px]">▶</span> {item.team}
            </p>
          </div>

          <div>
            <XIcon />
          </div>
        </div>

        <div className="flex p-[16px]">
          <div className="relative flex w-full max-w-[420px] flex-col">
            <div className="flex items-center gap-[8px]">
              <p className="w-full max-w-[52px] text-[14px] text-[#646464]">
                진행상태
              </p>

              <div
                className="flex h-[32px] w-full max-w-[360px] cursor-pointer items-center justify-between rounded-[4px] border-2 border-[#DBDBDB] px-[12px] py-[6px]"
                onClick={() => handleFormToggle('progress')}
              >
                <p>{formData.progress ?? item.progress}</p>

                <span className="text-[12px]">
                  {formToggle['progress'] ? '▼' : '▲'}
                </span>
              </div>
            </div>

            {formToggle['progress'] && (
              <div className="absolute top-[40px] z-10 flex w-full max-w-[360px] flex-col self-end rounded-[4px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                {optionProgress.map((opt) => (
                  <label
                    key={opt}
                    className="flex justify-between px-[12px] py-[6px] hover:bg-gray-50"
                  >
                    <p>{opt}</p>

                    <input
                      type="checkbox"
                      value={opt}
                      name="progress"
                      onChange={handleFormData}
                      checked={formData.progress === opt}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-[16px]">
          <button
            className="h-[36px] w-[224px] rounded-[8px] bg-[#0065FF] text-[14px] text-white duration-200 hover:bg-black disabled:bg-black"
            type="submit"
            disabled={loading}
          >
            {loading ? '처리 중...' : '추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
