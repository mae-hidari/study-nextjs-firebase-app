import Head from "next/head";
import { useAuthenticate } from "../hooks/authentication";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { user } = useAuthenticate();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>{user?.uid || "未ログイン"}</p>
      </main>
    </div>
  );
}
