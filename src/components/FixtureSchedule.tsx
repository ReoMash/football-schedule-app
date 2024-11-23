import { FixtureType } from '@/App';
import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Tooltip } from './ui/tooltip';

interface FixtureScheduleProps {
  fixtures: Record<string, FixtureType[]>;
}
export const FixtureSchedule = (props: FixtureScheduleProps) => {
  return (
    <VStack gap={5}>
      {Object.keys(props.fixtures).length === 0 && (
        <Text>No Team Selected</Text>
      )}
      {Object.entries(props.fixtures).map(([date, fixtures]) => {
        return (
          <React.Fragment key={date}>
            <Text colorPalette={'cyan'}>{date}</Text>
            {fixtures.map((fixture) => {
              const fixtureDate = new Date(fixture.date);
              return (
                <Tooltip
                  content={fixture.competition}
                  positioning={{ placement: 'bottom-start' }}
                  key={fixture.id}
                >
                  <Button
                    colorPalette={'cyan'}
                    variant={'outline'}
                    paddingY={7}
                    width={'75%'}
                    maxW={500}
                  >
                    <Flex
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      width='100%'
                    >
                      <Text
                        flexBasis={'30%'}
                        color={fixture.isHome ? 'yellow.100' : ''}
                      >
                        {fixture.homeTeam}
                      </Text>
                      <Text flexBasis={'20%'}>{`${fixtureDate
                        .getHours()
                        .toString()
                        .padStart(2, '0')}:${fixtureDate
                        .getMinutes()
                        .toString()
                        .padStart(2, '0')}`}</Text>{' '}
                      <Text
                        flexBasis={'30%'}
                        color={!fixture.isHome ? 'yellow.100' : ''}
                      >
                        {fixture.awayTeam}
                      </Text>
                    </Flex>
                  </Button>
                </Tooltip>
              );
            })}
          </React.Fragment>
        );
      })}
    </VStack>
  );
};
