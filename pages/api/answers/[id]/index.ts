import { NextApiRequest, NextApiResponse } from "next";
import "../../../../lib/firebase_admin";
import { firestore } from "firebase-admin";
import { Answer } from "../../../../model/Answer";
import { Question } from "../../../../model/Questions";

type Data = {
  answer: Answer;
  question: Question;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const id = req.query.id as string;

  const answerDoc = await firestore().collection("answers").doc(id).get();
  const answer = answerDoc.data() as Answer;
  answer.id = answerDoc.id;

  const questionDoc = await firestore()
    .collection("questions")
    .doc(answer.questionId)
    .get();

  const question = questionDoc.data() as Question;
  question.id = questionDoc.id;

  res.status(200).json({
    answer,
    question,
  });
};
