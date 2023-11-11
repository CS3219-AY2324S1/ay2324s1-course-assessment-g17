import functions_framework

from pymongo import MongoClient
import requests
import os
import sys
from dotenv import load_dotenv

load_dotenv()

MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
LEETCODE_API_URL = "https://leetcode.com/graphql"


def get_question_description(titleSlug):
    resp = requests.get(LEETCODE_API_URL, json={"query": "\n    query questionContent($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    content\n    mysqlSchemas\n    dataSchemas\n  }\n}\n    ", "variables": {
                        "titleSlug": titleSlug}, "operationName": "questionContent"})
    data = resp.json()
    return data["data"]["question"]["content"]


def get_all_questions(limit):
    resp = requests.get(LEETCODE_API_URL, json={"query": "query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList: questionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total: totalNum\n    questions: data {\n      acRate\n      difficulty\n      freqBar\n      frontendQuestionId: questionFrontendId\n      isFavor\n      paidOnly: isPaidOnly\n      status\n      title\n      titleSlug\n      topicTags {\n        name\n        id\n        slug\n      }\n      hasSolution\n      hasVideoSolution\n    }\n  }\n}", "variables": {"categorySlug": "", "skip": 0, "limit": limit, "filters": {}}})
    data = resp.json()["data"]["problemsetQuestionList"]["questions"]
    processed = []
    for question in data:
        if question["paidOnly"]:
            continue
        current = {}
        current["questionID"] = int(question["frontendQuestionId"])
        current["title"] = question["title"]
        current["categories"] = [tag["name"] for tag in question["topicTags"]]
        current["complexity"] = question["difficulty"]
        current["linkToQuestion"] = "https://leetcode.com/problems/" + \
            question["titleSlug"]
        current["questionDescription"] = get_question_description(
            question["titleSlug"])
        processed.append(current)
    return processed


def populate_with_limit(limit):
    questions = get_all_questions(limit)

    myclient = MongoClient(MONGO_CONNECTION_STRING)

    db = myclient["peerprep_app"]
    collection = db["questions"]

    collection.delete_many({})
    collection.insert_many(questions)
    return questions


@functions_framework.http
def scrape_leetcode(request):
    """HTTP Cloud Function."""
    request_args = request.args

    if request_args and 'limit' in request_args:
        limit = request_args['limit']
    else:
        limit = 10000

    questions = populate_with_limit(limit)

    return 'Questions database populated with {} questions!'.format(len(questions))


if __name__ == "__main__":
    limit = 10000 if len(sys.argv) == 1 else int(sys.argv[1])
    populate_with_limit(limit)
