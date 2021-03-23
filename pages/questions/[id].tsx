import firebase from "firebase";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useAuthenticate } from "../../hooks/authentication";
import { Question } from "../../model/Questions";
import { Answer } from "../../model/Answer";

type Query = {
  id: string;
};

export default function QuestionsShow() {
  const router = useRouter();
  const query = router.query as Query;
  const { user } = useAuthenticate();
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [question, setQuestion] = useState<Question>(null);
  const [answer, setAnswer] = useState<Answer>(null);

  const loadData = async () => {
    if (query.id === undefined) {
      return;
    }

    const questionDoc = await firebase
      .firestore()
      .collection("questions")
      .doc(query.id)
      .get();

    if (!questionDoc.exists) {
      return;
    }

    const gotQuestion = questionDoc.data() as Question;
    gotQuestion.id = questionDoc.id;
    setQuestion(gotQuestion);

    if (!gotQuestion.isReplied) {
      return;
    }
    console.log(
      "🚀 ~ file: [id].tsx ~ line 42 ~ loadData ~ gotQuestion",
      gotQuestion
    );

    const answerSnapshot = await firebase
      .firestore()
      .collection("answers")
      .where("questionId", "==", gotQuestion.id)
      .limit(1)
      .get();
    if (answerSnapshot.empty) {
      return;
    }

    const gotAnswer = answerSnapshot.docs[0].data() as Answer;

    gotAnswer.id = answerSnapshot.docs[0].id;
    setAnswer(gotAnswer);
  };

  useEffect(() => {
    loadData();
  }, [query.id]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    await firebase.firestore().runTransaction(async (t) => {
      t.set(firebase.firestore().collection("answers").doc(), {
        uid: user.uid,
        questionId: question.id,
        body,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      t.update(firebase.firestore().collection("questions").doc(question.id), {
        isReplied: true,
      });
    });

    const now = new Date().getTime();
    setAnswer({
      id: "",
      uid: user.uid,
      questionId: question.id,
      body,
      createdAt: new firebase.firestore.Timestamp(now / 1000, now % 1000),
    });
  };

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {question && (
            <div className="card">
              <div className="card-body">{question.body}</div>
            </div>
          )}
        </div>
        <section className="text-center mt-4">
          <h2 className="h4">回答する</h2>
          {answer === null ? (
            <form onSubmit={onSubmit}>
              <textarea
                className="form-control"
                placeholder="おげんきですか？"
                rows={6}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
              <div className="m-3">
                {isSending ? (
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    回答する
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="card">
              <div className="card-body text-left">{answer.body}</div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
