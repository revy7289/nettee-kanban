import '@/App.css';

import { useState } from 'react';

import { E_Team, netteeMembers } from './shared/constants/kanban';

export function App() {
  const [selectedTeam, setSelectedTeam] = useState<E_Team>(E_Team.all);
  const [isSidebarItemOpen, setIsSidebarItemOpen] = useState<
    Record<string, boolean>
  >({
    project: true,
    team: true,
    assignee: true,
    label: true,
    more: true,
  });

  const projectList = ['전체', 'Blolet', 'KanBan'];
  const dummyLabels = [
    '보류',
    '낮음',
    '보통',
    '보통',
    '높음',
    '높음',
    '매우 높음',
  ];

  const teamList = Object.values(E_Team);
  const allMembers = Object.values(netteeMembers).flat();

  const teamKanban = teamList.filter((team) => team !== E_Team.all);
  const teamMembers =
    selectedTeam === E_Team.all ? allMembers : netteeMembers[selectedTeam];

  return (
    <main className="flex h-full w-full">
      <aside className="flex max-w-[326px] min-w-[234px] flex-col bg-[#f8f8f8] p-[20px]">
        <div className="flex flex-col gap-[40px]">
          <h1 className="text-center text-[24px] font-bold">Nettee's KanBan</h1>
          <input
            className="rounded-[4px] border border-[#dbdbdb] bg-white px-[12px] py-[6px]"
            type="search"
            placeholder="검색"
          />
        </div>

        <div className="flex items-center justify-between pt-[20px] pb-[10px]">
          <p className="py-[6px]">필터</p>
          <button type="reset">초기화</button>
        </div>

        <div className="border-t border-[#dbdbdb] py-[20px]">
          <div className="flex items-center justify-between">
            <p>프로젝트 선택</p>
            <button
              type="button"
              onClick={() =>
                setIsSidebarItemOpen((prev) => ({
                  ...prev,
                  project: !prev.project,
                }))
              }
            >
              {isSidebarItemOpen.project ? '▼' : '▲'}
            </button>
          </div>

          <ul
            className={`overflow-hidden pt-[10px] ${isSidebarItemOpen.project ? 'h-full' : 'h-0'}`}
          >
            {projectList.map((proj) => (
              <li
                key={`${proj}_project`}
                className="flex items-center gap-[8px] px-[8px] py-[6px]"
              >
                <label className="flex h-[24px] w-[24px] items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-[18px] w-[18px] rounded-[4px]"
                  />
                </label>

                {proj}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[#dbdbdb] py-[20px]">
          <div className="flex items-center justify-between">
            <p>팀 선택</p>
            <button
              type="button"
              onClick={() =>
                setIsSidebarItemOpen((prev) => ({
                  ...prev,
                  team: !prev.team,
                }))
              }
            >
              {isSidebarItemOpen.team ? '▼' : '▲'}
            </button>
          </div>

          <ul
            className={`overflow-hidden pt-[10px] ${isSidebarItemOpen.team ? 'h-full' : 'h-0'}`}
          >
            {teamList.map((team) => (
              <li
                key={`${team}_team`}
                className="flex items-center gap-[8px] px-[8px] py-[6px]"
              >
                <label className="flex h-[24px] w-[24px] items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-[18px] w-[18px] rounded-[4px]"
                  />
                </label>

                {team}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[#dbdbdb] py-[20px]">
          <div className="flex items-center justify-between">
            <p>담당자</p>
            <button
              type="button"
              onClick={() =>
                setIsSidebarItemOpen((prev) => ({
                  ...prev,
                  assignee: !prev.assignee,
                }))
              }
            >
              {isSidebarItemOpen.assignee ? '▼' : '▲'}
            </button>
          </div>

          <div
            className={`flex flex-col overflow-hidden pt-[10px] ${isSidebarItemOpen.assignee ? 'h-full' : 'h-0'}`}
          >
            <div className="flex flex-wrap gap-[8px] pt-[8px] pb-[16px]">
              {teamList.map((team) => (
                <button
                  key={`${team}_button`}
                  type="button"
                  className={`flex h-[28px] w-[60px] items-center justify-center rounded-[4px] ${selectedTeam === team ? 'bg-[#0065FF] text-white' : 'bg-[#ededed]'}`}
                  onClick={() => setSelectedTeam(team)}
                >
                  {team}
                </button>
              ))}
            </div>

            <ul className="h-[306px] w-full overflow-y-scroll">
              {teamMembers.map((member, idx) => (
                <li
                  key={`${idx + member}_assignee`}
                  className="flex items-center gap-[8px] px-[8px] py-[6px]"
                >
                  <label className="flex h-[24px] w-[24px] items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-[18px] w-[18px] rounded-[4px]"
                    />
                  </label>

                  <div className="h-[20px] w-[20px] rounded-full bg-[#dbdbdb]"></div>

                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#dbdbdb] py-[20px]">
          <div className="flex items-center justify-between">
            <p>라벨</p>
            <button
              type="button"
              onClick={() =>
                setIsSidebarItemOpen((prev) => ({
                  ...prev,
                  label: !prev.label,
                }))
              }
            >
              {isSidebarItemOpen.label ? '▼' : '▲'}
            </button>
          </div>

          <div
            className={`flex flex-col overflow-hidden pt-[10px] ${isSidebarItemOpen.label ? 'h-full' : 'h-0'}`}
          >
            <div className="flex flex-wrap gap-[8px] p-[8px]">
              {dummyLabels.map((label, idx) => (
                <span
                  key={`${idx + label}_label`}
                  className="h-[24px] rounded-full bg-[#ededed] px-[12px] py-[2px]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#dbdbdb] py-[20px]">
          <div className="flex items-center justify-between">
            <p>보기</p>
            <button
              type="button"
              onClick={() =>
                setIsSidebarItemOpen((prev) => ({
                  ...prev,
                  more: !prev.more,
                }))
              }
            >
              {isSidebarItemOpen.more ? '▼' : '▲'}
            </button>
          </div>

          <div
            className={`flex flex-col overflow-hidden pt-[10px] ${isSidebarItemOpen.more ? 'h-full' : 'h-0'}`}
          >
            <div className="flex gap-[10px] p-[8px]">
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-[#ededed] p-[6px] font-bold text-[#0065FF]">
                P
              </span>
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-[#ededed] p-[6px] font-bold text-[#0065FF]">
                G
              </span>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex h-full w-full flex-col gap-[16px] px-[40px] pt-[60px]">
        <div className="flex items-center justify-between px-[16px] py-[8px] text-[32px] font-bold">
          <h2>💙 Blolet</h2>
          <div className="mx-[16px] my-[8px] flex h-[32px] w-[32px] items-center justify-center text-[24px]">
            ▼
          </div>
        </div>

        {teamKanban.map((team) => (
          <article
            key={`${team}_kanban`}
            className="flex flex-col gap-[16px] rounded-[8px] bg-[#f5f5f5] p-[16px] font-medium"
          >
            <div className="flex justify-between">
              <p className="text-[16px] font-semibold">{team}</p>
              <button type="button">▼</button>
            </div>

            <div className="flex flex-wrap gap-[8px]">
              <div className="max-h-[860px] min-h-[152px] flex-1 bg-[#FFFBDE] px-[20px] py-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-[8px]">
                    <p>TO DO</p>
                    <p className="text-[#F9AA01]">888</p>
                  </div>
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-white text-[20px]">
                    +
                  </div>
                </div>
              </div>
              <div className="max-h-[860px] min-h-[152px] flex-1 bg-[#E7F3FE] px-[20px] py-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-[8px]">
                    <p>DOING</p>
                    <p className="text-[#1E85E4]">888</p>
                  </div>
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-white text-[20px]">
                    +
                  </div>
                </div>
              </div>
              <div className="max-h-[860px] min-h-[152px] flex-1 bg-[#EEFBE6] px-[20px] py-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-[8px]">
                    <p>DONE</p>
                    <p className="text-[#58BE1A]">888</p>
                  </div>
                  <div className="flex gap-[8px]">
                    <div className="flex h-[32px] w-[86px] items-center justify-center rounded-[8px] bg-white">
                      전체보기
                    </div>
                    <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-white text-[20px]">
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="my-[32px] w-full border-b border-[#dbdbdb]"></div>
      </section>
    </main>
  );
}
