import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { type User } from '../../types/users/users';
import './Heatmap.css';

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

const HeatmapComponent: React.FC<HeatmapProps> = ({ user }) => {
  const [activityData, setActivityData] = useState<Array<{ date: string; count: number }>>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/get-answered-questions/${user.id}`);
        const data = (await response.json()) as AnsweredQuestion[];
        console.log(data);
        const activityMap: Record<string, number> = {};
        data.forEach((item: { answeredAt: string }) => {
          const date = item.answeredAt.split('T')[0];
          activityMap[date] = activityMap[date] !== undefined ? activityMap[date] + 1 : 1;
          console.log(date);
        });

        const formattedData = Object.keys(activityMap).map((date) => ({
          date,
          count: activityMap[date],
        }));

        console.log(formattedData);

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
    />
  );
};

export default HeatmapComponent;
