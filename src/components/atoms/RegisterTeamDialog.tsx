import { Center, DialogFooter } from '@chakra-ui/react';
import { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { leagueOptions, TeamType } from '@/App';
import { Button } from '../ui/button';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog';

interface RegisterTeamDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedTeams: TeamType[];
  setSelectedTeams: (teams: TeamType[]) => void;
  allTeams: TeamType[];
}

const DEFAULT_COUNTRY = 'England';
const DEFAULT_LEAGUE = 'Premier League';
const DEFAULT_TEAM: TeamType = {
  id: 57,
  name: 'Arsenal FC',
  shortName: 'Arsenal',
  tla: '',
  crest: '',
  clubColors: '',
  area: 'England',
  league: 'Premier League',
};

export const RegisterTeamDialog = (props: RegisterTeamDialogProps) => {
  const [selectedCountry, setSelectedCountry] =
    useState<string>(DEFAULT_COUNTRY);
  const [selectedLeague, setSelectedLeague] = useState<string>(DEFAULT_LEAGUE);
  const [selectedTeam, setSelectedTeams] = useState<TeamType>(DEFAULT_TEAM);

  const countryOptions = [...new Set(leagueOptions.map((team) => team.area))];
  const leagueNameOptions = [
    ...new Set(
      leagueOptions
        .filter((team) => team.area === selectedCountry)
        .map((team) => team.league)
    ),
  ];
  const teamOptions = props.allTeams
    .filter((team) => team.area === selectedCountry)
    .filter((team) => team.league === selectedLeague);

  // handle carousel change
  const handleCountryChange = (nextSlide: number) => {
    const newCountry = countryOptions[nextSlide];
    const newLeague = props.allTeams
      .filter((team) => team.area === newCountry)
      .map((team) => team.league)[0];

    setSelectedCountry(newCountry);
    setSelectedLeague(newLeague);
    setSelectedTeams(
      props.allTeams
        .filter((team) => team.area === newCountry)
        .filter((team) => team.league === newLeague)[0]
    );
  };

  const handleLeagueChange = (nextSlide: number) => {
    const newLeague = leagueNameOptions[nextSlide];
    setSelectedLeague(newLeague);
    setSelectedTeams(
      props.allTeams.filter((team) => team.league === newLeague)[0]
    );
  };

  const handleTeamChange = (nextSlide: number) => {
    setSelectedTeams(teamOptions[nextSlide]);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const onCloseDialog = () => {
    props.setIsDialogOpen(false);
    // back to default
    setSelectedCountry(DEFAULT_COUNTRY);
    setSelectedLeague(DEFAULT_LEAGUE);
    setSelectedTeams(DEFAULT_TEAM);
  };

  return (
    <>
      <DialogRoot open={props.isDialogOpen}>
        <DialogContent boxShadow='0px 0px 10px 5px rgba(0, 0, 0, 0.5)'>
          <DialogHeader>
            <DialogTitle>Add Your Favorite Team!</DialogTitle>
          </DialogHeader>
          <DialogBody spaceY={10}>
            <Carousel
              responsive={responsive}
              beforeChange={handleCountryChange} // Track the next slide
            >
              {countryOptions.map((country, index) => (
                <Center key={index}> {country}</Center>
              ))}
            </Carousel>
            <Carousel
              responsive={responsive}
              beforeChange={handleLeagueChange} // Track the next slide
            >
              {leagueNameOptions.map((league, index) => (
                <Center key={index}>{league}</Center>
              ))}
            </Carousel>
            <Carousel
              responsive={responsive}
              beforeChange={handleTeamChange} // Track the next slide
            >
              {teamOptions.map((team, index) => (
                <Center key={index}>{team.name}</Center>
              ))}
            </Carousel>
          </DialogBody>
          <DialogFooter>
            <Button
              colorPalette='cyan'
              variant={'outline'}
              onClick={onCloseDialog}
            >
              Cancel
            </Button>
            <Button
              colorPalette='cyan'
              onClick={() => {
                if (
                  !props.selectedTeams
                    .map((team) => team.id)
                    .includes(selectedTeam.id)
                ) {
                  props.setSelectedTeams([
                    ...props.selectedTeams,
                    selectedTeam,
                  ]);
                }
                onCloseDialog();
              }}
              disabled={!selectedTeam}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
