import { FilterQuery } from "mongoose";
import Matching, {
  MatchStatusEnum,
  QuestionComplexityEnum,
} from "../models/matching";
import matching from "../models/matching";

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

function findIntersection(arr1: string[], arr2: string[]) {
  // If one user has no preference, take the preferences of the other user.
  if (!arr1) return arr2;
  if (!arr2) return arr1;

  // If they both have preferences, take only what is common between them.
  return arr1.filter((item) => arr2.includes(item));
}

export async function findPendingMatchesOfUser(user_id: number) {
  const pendingMatches = await Matching.find({
    user_id: user_id,
    status: MatchStatusEnum.PENDING,
  }).exec();
  return pendingMatches;
}

export async function findMatch(matchingInfo: MatchingInfo) {
  const difficulty_level_query: FilterQuery<typeof Matching>[] =
    matchingInfo.difficulty_level
      ? [
          {
            $or: [
              {
                difficulty_levels: {
                  $elemMatch: { $in: matchingInfo.difficulty_level },
                },
              },
              {
                difficulty_levels: {
                  $size: 0,
                },
              },
            ],
          },
        ]
      : [];

  const topics_query: FilterQuery<typeof Matching>[] = matchingInfo.topics
    ? [
        {
          $or: [
            {
              categories: {
                $elemMatch: { $in: matchingInfo.topics },
              },
            },
            {
              categories: {
                $size: 0,
              },
            },
          ],
        },
      ]
    : [];

  const potentialMatch = await Matching.findOne({
    status: MatchStatusEnum.PENDING,
    $and: difficulty_level_query.concat(topics_query),
    user_id: {
      $ne: matchingInfo.user_id,
    },
  }).exec();

  if (!potentialMatch) return null;

  const processedMatch = {
    ...potentialMatch.toObject(),
    categories: findIntersection(
      potentialMatch.categories,
      matchingInfo.topics,
    ),
    difficulty_levels: findIntersection(
      potentialMatch.difficulty_levels,
      matchingInfo.difficulty_level,
    ),
  };

  await potentialMatch.updateOne({ status: MatchStatusEnum.MATCHED });
  return processedMatch;
}

export async function markAsTimeout(matchingInfo: MatchingInfo) {
  await matching.findOneAndUpdate(
    {
      user_id: matchingInfo.user_id,
      socket_id: matchingInfo.socket_id,
      status: MatchStatusEnum.PENDING,
    },
    { status: MatchStatusEnum.TIMEOUT },
  );
}
