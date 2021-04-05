import Link from "next/link";
import Layout from "../components/Layout";
import { useAuthenticate } from "../hooks/authentication";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { user } = useAuthenticate();

  return (
    <Layout>
      <div className="text-center">
        <div className="row">
          <div className="col-12 col-md-6">
            <h1>My質問サービス</h1>
            <p>ここは質問をしたり回答できるサービスです。</p>
            <Link href="/users/me">
              <a className="btn btn-primary" role="button">
                質問してもらう！
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
