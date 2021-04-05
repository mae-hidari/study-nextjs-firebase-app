import Layout from "../../../components/Layout";
import { Answer } from "../../../model/Answer";
import { Question } from "../../../model/Questions";
import Head from "next/head";
import TwitterShareButton from "../../../components/TwitterShareButton";

type Props = {
  answer: Answer;
  question: Question;
};

const getDescription = (answer: Answer) => {
  const body = answer.body.trim().replace(/[ \r\n]/g, "");
  if (body.length < 140) {
    return body;
  }
  return body.substring(0, 140) + "...";
};

export default function AnswersShow(props: Props) {
  const description = getDescription(props.answer);
  return (
    <Layout>
      <Head>
        <meta name="description" key="description" content={description} />
      </Head>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <>
            <div className="card">
              <div className="card-body">{props.question.body}</div>
            </div>

            <section className="text-center mt-4">
              <h2 className="h4">回答</h2>

              <div className="card">
                <div className="card-body text-left">{props.answer.body}</div>
              </div>
            </section>

            <div className="my-3 d-flex justify-content-center">
              <TwitterShareButton
                url={`${process.env.NEXT_PUBLIC_WEB_URL}/answers/${props.answer.id}`}
                text={props.answer.body}
              ></TwitterShareButton>
            </div>
          </>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const res = await fetch(process.env.API_URL + `/api/answers/${query.id}`);
  const json = await res.json();
  return { props: json };
}
