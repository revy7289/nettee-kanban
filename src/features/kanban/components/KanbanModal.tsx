import { Dispatch, FormEvent, SetStateAction, useState } from 'react';

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

  console.log(item.repo);
  console.log(item.project, item.team, item.progress);

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

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && setModal(null)}
    >
      <form
        className="flex h-[520px] w-[800px] flex-col gap-[20px] rounded-[8px] bg-white p-[20px]"
        onSubmit={handleSubmit}
      >
        <label className="flex w-full flex-col gap-[8px]">
          <p>제목</p>
          <input
            className="h-[40px] w-full rounded-[8px] bg-[#f5f5f5] px-[12px] py-[8px]"
            type="text"
            defaultValue={item.title}
            name="title"
          />
        </label>

        <label className="flex w-full flex-col gap-[8px]">
          <p>상세 내용</p>
          <textarea
            className="h-[200px] w-full resize-none rounded-[8px] bg-[#f5f5f5] px-[12px] py-[8px]"
            defaultValue={item.body}
            name="body"
          ></textarea>
        </label>

        <button
          className="h-[36px] w-[224px] rounded-[8px] bg-[#0065FF] text-white duration-200 hover:bg-black disabled:bg-black"
          type="submit"
          disabled={loading}
        >
          {loading ? '처리 중...' : '테스트'}
        </button>
      </form>
    </div>
  );
}
