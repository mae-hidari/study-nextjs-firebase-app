import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { useAuthenticate } from "../../hooks/authentication";
import { Question } from "../../model/Questions";
import dayjs from "dayjs";
import Link from "next/link";

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPaginationFinished, setIsPaginationFinished] = useState(false);

  const scrollContainerRef = useRef(null);

  const { user } = useAuthenticate();

  const createBaseQuery = () => {
    return firebase
      .firestore()
      .collection("questions")
      .where("receiverUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .limit(10);
  };

  const appendQuestions = (
    snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) => {
    const gotQuestions = snapshot.docs.map((doc) => {
      const question = doc.data() as Question;
      question.id = doc.id;
      return question;
    });
    setQuestions(questions.concat(gotQuestions));
  };

  const loadQuestions = async () => {
    const snapshot = await createBaseQuery().get();

    if (snapshot.empty) {
      return;
    }

    appendQuestions(snapshot);
  };

  const loadNextQuestions = async () => {
    if (questions.length === 0) {
      return;
    }

    const lastQuestions = questions[questions.length - 1];
    const snapshot = await createBaseQuery()
      .startAfter(lastQuestions.createdAt)
      .get();

    if (snapshot.empty) {
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapshot);
  };

  useEffect(() => {
    if (!process.browser) {
      return;
    }

    if (user === null) {
      return;
    }

    loadQuestions();
  }, [process.browser, user]);

  const onScroll = () => {
    if (isPaginationFinished) {
      return;
    }

    const container = scrollContainerRef.current;
    if (container === null) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.top + rect.height > window.innerHeight) {
      return;
    }

    loadNextQuestions();
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [questions, scrollContainerRef.current, isPaginationFinished]);

  return (
    <Layout>
      <h1 className="h4">???????????????????????????</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
          {questions.map((question) => (
            <Link href={`/questions/${question.id}`} key={question.id}>
              <a>
                <div className="card my-3">
                  <div className="card-body">
                    <div className="text-truncate">{question.body}</div>
                    <div className="text-muted text-end">
                      <small>
                        {dayjs(question.createdAt.toDate()).format(
                          "YYYY/MM/DD HH:mm"
                        )}
                      </small>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
