import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { type User } from '../../types/users/users';
import './Heatmap.css';
import Tooltip from 'react-tooltip';
import { Flex, Text } from '@chakra-ui/react';

interface HeatmapProps {
  user: User;
}

interface AnsweredQuestion {
  id: number;
  userId: number;
  questionId: number;
  complexity: string;
  category: string[];
  answeredAt: string;
}

const getMonth = (monthNumber: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1];
};

const HeatmapComponent: React.FC<HeatmapProps> = ({ user }) => {
  const [activityData, setActivityData] = useState<Array<{ date: string; count: number }>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const userServiceUrl = process.env.REACT_APP_USER_SERVICE_BACKEND_URL;
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(`${userServiceUrl}api/user/get-answered-questions/${user.id}`);
        const data = (await response.json()) as AnsweredQuestion[];
        const activityMap: Record<string, number> = {};
        let total = 0;
        data.forEach((item: { answeredAt: string }) => {
          const date = item.answeredAt.split('T')[0];
          activityMap[date] = activityMap[date] !== undefined ? activityMap[date] + 1 : 1;
          total++;
        });

        setTotalCount(total);
        const formattedData = Object.keys(activityMap).map((date) => ({
          date,
          count: activityMap[date],
        }));

        setActivityData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [user.id]);

  return (
    <Flex direction="column" align="left" textAlign="left">
      <Text fontSize="sm" mb={2}>
        {' '}
        {totalCount} {totalCount === 1 ? 'submission' : 'submissions'} in last year{' '}
      </Text>
      <CalendarHeatmap
        startDate={new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate())}
        endDate={new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate())}
        values={activityData}
        classForValue={(value) => {
          if (value !== null && typeof value === 'object' && 'count' in value) {
            const countValue = value as { count: number };
            return `color-github-${countValue.count}`;
          }
          return 'color-empty';
        }}
        tooltipDataAttrs={(value: { date?: string; count?: number } | null) => {
          if (value?.date === undefined || value.count === null) {
            return { 'data-tip': `No question recorded!` };
          }
          const dateParts = value.date.split('-');
          const formattedDate = `${parseInt(dateParts[2], 10)} ${getMonth(parseInt(dateParts[1], 10))}`;
          const pluralized = value.count === 1 ? 'question' : 'questions';
          return { 'data-tip': `${value.count} ${pluralized} solved on ${formattedDate}!` };
        }}
      />
      <Tooltip />
    </Flex>
  );
};

export default HeatmapComponent;
