from pymongo import MongoClient
import requests
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
LEETCODE_API_URL = "https://leetcode.com/graphql"


def getQuestionDescription(titleSlug):
    resp = requests.get(LEETCODE_API_URL, json={"query": "\n    query questionContent($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    content\n    mysqlSchemas\n    dataSchemas\n  }\n}\n    ", "variables": {
                        "titleSlug": titleSlug}, "operationName": "questionContent"})
    data = resp.json()
    return data["data"]["question"]["content"]


def getAllQuestions(limit):
    resp = requests.get(LEETCODE_API_URL, json={"query": "query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList: questionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total: totalNum\n    questions: data {\n      acRate\n      difficulty\n      freqBar\n      frontendQuestionId: questionFrontendId\n      isFavor\n      paidOnly: isPaidOnly\n      status\n      title\n      titleSlug\n      topicTags {\n        name\n        id\n        slug\n      }\n      hasSolution\n      hasVideoSolution\n    }\n  }\n}", "variables": {"categorySlug": "", "skip": 0, "limit": limit, "filters": {}}})
    data = resp.json()["data"]["problemsetQuestionList"]["questions"]
    processed = []
    for question in data:
        current = {}
        current["questionID"] = int(question["frontendQuestionId"])
        current["title"] = question["title"]
        current["categories"] = [tag["name"] for tag in question["topicTags"]]
        current["complexity"] = question["difficulty"]
        current["linkToQuestion"] = "https://leetcode.com/problems/" + \
            question["titleSlug"]
        current["questionDescription"] = getQuestionDescription(
            question["titleSlug"])
        processed.append(current)
    return processed


questions = getAllQuestions(10000)


myclient = MongoClient(MONGO_CONNECTION_STRING)

db = myclient["peerprep_app"]
collection = db["questions"]

collection.delete_many({})
collection.insert_many(questions)
