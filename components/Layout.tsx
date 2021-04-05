import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
  const title = "My質問回答サービス";
  const description = "質問と回答を行えるサービスです。";

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" key="description" content={description} />
        <meta property="og:title" key="ogTitle" content={title} />
        <meta property="og:site_name" key="ogSiteName" content={title} />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
      </Head>
      <nav
        className="navbar navbar-expand-lg navbar-light mb-3"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <div className="container">
          <div className="mr-auto">
            <a className="navbar-brand" href="/">
              My質問サービス
            </a>
          </div>
        </div>
      </nav>
      <div className="container">{children}</div>
      <nav className="navbar fixed-bottom navbar-light bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <i className="material-icons">menu</i>
            <Link href="/questions/received">
              <a>
                <i className="material-icons">home</i>
              </a>
            </Link>
            <Link href="/users/me">
              <a>
                <i className="material-icons">person</i>
              </a>
            </Link>
          </div>
        </div>
      </nav>
      <footer className="text-center mt-5 py-5 bg-light">
        <div className="pb-1 text-muted">
          Created by{" "}
          <a href="https://twitter.com/kento_kuga" className="link-info">
            @kento_kuga
          </a>
        </div>
      </footer>
    </div>
  );
}
