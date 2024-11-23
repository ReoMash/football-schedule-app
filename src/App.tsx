import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { FixtureSchedule } from './components/FixtureSchedule';
import { PageHeader } from './components/PageHeader';
import { CustomizeTeamDialog } from './components/atoms/CustomizeTeamDialog';

export type TeamType = {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  clubColors: string;
  area: string;
  league: string;
};

export type FixtureType = {
  id: number;
  competition: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  selectedTeam: TeamType;
  isHome: boolean;
};

export const leagueOptions = [
  { id: 1, area: 'England', league: 'Premier League' },
  { id: 2, area: 'Spain', league: 'Primera Division' },
  { id: 3, area: 'Germany', league: 'Bundesliga' },
  { id: 4, area: 'Italy', league: 'Serie A' },
];

function App() {
  const [fixtures, setFixtures] = useState<Record<string, FixtureType[]>>({});

  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([]);

  useEffect(() => {
    invoke<FixtureType[]>('get_fixtures', { selectedTeams })
      .then((response) => {
        setFixtures(
          response
            // order by date
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            // group by date
            .reduce((acc, fixture) => {
              const dateTime = new Date(fixture.date);
              const date = `${dateTime.getFullYear()}-${(
                dateTime.getMonth() + 1
              )
                .toString()
                .padStart(2, '0')}-${dateTime
                .getDate()
                .toString()
                .padStart(2, '0')}`;
              if (!acc[date]) {
                acc[date] = [];
              }
              acc[date].push(fixture);
              return acc;
            }, {} as Record<string, FixtureType[]>)
        );
      })
      .catch((error) => console.error('Failed to fetch teams', error));
  }, [selectedTeams]);

  return (
    <>
      <PageHeader />
      <FixtureSchedule fixtures={fixtures} />
      <CustomizeTeamDialog
        selectedTeams={selectedTeams}
        setSelectedTeams={setSelectedTeams}
      />
    </>
  );
}

export default App;
