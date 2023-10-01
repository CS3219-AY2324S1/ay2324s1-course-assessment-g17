import Matching, {
  MatchStatusEnum,
  QuestionComplexityEnum,
} from "../models/matching";

interface MatchingInfo {
  user_id: number;
  socket_id: string;
  difficulty_level: QuestionComplexityEnum[];
  topics: string[];
  status: MatchStatusEnum;
}

export async function insertMatching(matchingInfo: MatchingInfo) {
  try {
    const newMatching = await Matching.create({
      user_id: matchingInfo.user_id,
      socket_id: matchingInfo.socket_id,
      difficulty_levels: matchingInfo.difficulty_level,
      categories: matchingInfo.topics,
      status: matchingInfo.status,
    });

    return newMatching;
  } catch (error) {
    throw error;
  }
}
