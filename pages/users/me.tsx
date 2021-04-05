import Layout from "../../components/Layout";
import TwitterShareButton from "../../components/TwitterShareButton";
import { useAuthenticate } from "../../hooks/authentication";

export default function UserMe() {
  const { user } = useAuthenticate();

  if (user === null) {
    return (
      <Layout>
        <div></div>
      </Layout>
    );
  }

  const url = `${process.env.NEXT_PUBLIC_WEB_URL}/users/${user.uid}`;

  return (
    <Layout>
      <section className="text-center">
        <h1 className="h4">マイページ</h1>
        <p className="user-select-all overflow-auto">{url}</p>
        <p>このURLをシェアしてみんなに質問してもらおう!</p>
        <div className="d-flex justify-content-center">
          <TwitterShareButton url={url} text="質問してね！" />
        </div>
      </section>
    </Layout>
  );
}
