import { leagueOptions, TeamType } from '@/App';
import { Box, DialogFooter, Flex, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { RegisterTeamDialog } from './RegisterTeamDialog';
import { invoke } from '@tauri-apps/api/core';

interface CustomizeTeamDialogProps {
  selectedTeams: TeamType[];
  setSelectedTeams: (teams: TeamType[]) => void;
}

export const CustomizeTeamDialog = (props: CustomizeTeamDialogProps) => {
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const openRegisterDialog = () => setIsRegisterDialogOpen(true);

  const [allTeams, setAllTeams] = useState<TeamType[]>([]);

  return (
    <>
      <DialogRoot open={isCustomizeDialogOpen} size={'full'}>
        <DialogTrigger asChild>
          <Button
            colorPalette='cyan'
            variant='surface'
            borderRadius={20}
            position='fixed'
            bottom={10}
            right={10}
            onClick={() => setIsCustomizeDialogOpen(true)}
            boxShadow={'md'}
          >
            <span className='material-icons'>tune</span>
            Customize
          </Button>
        </DialogTrigger>

        <DialogContent spaceY={0} maxH={600} overflowY={'scroll'} bg={'black'}>
          <DialogHeader lineHeight={3} color={'white'}>
            <DialogTitle>Customize Your Teams</DialogTitle>
            Choose & Manage your favorite Teams!
          </DialogHeader>
          <DialogBody>
            <VStack gap={3} alignItems={'start'}>
              {leagueOptions.map((competition) => {
                const teamsOnThisCompetition = props.selectedTeams.filter(
                  (team) => team.league === competition.league
                );
                return teamsOnThisCompetition.length !== 0 ? (
                  <Box
                    bg={'gray.800'}
                    paddingX={3}
                    paddingY={4}
                    borderRadius={5}
                    w={'full'}
                    spaceY={4}
                    key={competition.id}
                  >
                    <Text fontSize={'lg'} color={'white'}>
                      {competition.league}
                    </Text>
                    <Flex gap={3} wrap={'wrap'} gapY={2}>
                      {teamsOnThisCompetition.map((team) => {
                        return (
                          <Button
                            colorPalette='cyan'
                            variant='subtle'
                            onClick={() => {
                              props.setSelectedTeams([
                                ...props.selectedTeams.filter(
                                  (element) =>
                                    element.shortName !== team.shortName
                                ),
                              ]);
                            }}
                            key={team.shortName}
                          >
                            <span className='material-icons'>close</span>
                            {team.shortName}
                          </Button>
                        );
                      })}
                    </Flex>
                  </Box>
                ) : null;
              })}
            </VStack>
          </DialogBody>
          <DialogFooter position={'sticky'} bottom='0' zIndex='1' paddingX={4}>
            <Button
              opacity={0.75}
              colorPalette='cyan'
              variant={'outline'}
              borderRadius={20}
              onClick={() => setIsCustomizeDialogOpen(false)}
            >
              Close
            </Button>
            {/* Button to open the Register dialog */}
            <Button
              colorPalette={'cyan'}
              borderRadius={20}
              onClick={() => {
                invoke<TeamType[]>('get_teams', {})
                  .then((response) => {
                    setAllTeams(response);
                  })
                  .catch((error) =>
                    console.error('Failed to fetch teams', error)
                  );
                openRegisterDialog();
              }}
            >
              <span className='material-icons'>add</span>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      {/* Register Dialog */}
      <RegisterTeamDialog
        isDialogOpen={isRegisterDialogOpen}
        setIsDialogOpen={setIsRegisterDialogOpen}
        selectedTeams={props.selectedTeams}
        setSelectedTeams={props.setSelectedTeams}
        allTeams={allTeams}
      />
    </>
  );
};
