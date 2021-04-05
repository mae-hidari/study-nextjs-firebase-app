import firebase from "firebase/app";
import { useRouter } from "next/router";
import { FormEvent, useState, useEffect } from "react";
import { User } from "../../model/User";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import Link from "next/link";

type Query = {
  uid: string;
};

export default function UserShow() {
  const [user, setUser] = useState<User>(null);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const router = useRouter();
  const query = router.query as Query;
  const currentUser =
    typeof window !== "undefined" ? firebase.auth().currentUser : null;

  useEffect(() => {
    if (query.uid === undefined) {
      return;
    }

    const loadUser = async () => {
      const doc = await firebase
        .firestore()
        .collection("users")
        .doc(query.uid)
        .get();

      if (!doc.exists) {
        return;
      }

      const getUser = doc.data() as User;
      getUser.uid = doc.id;
      setUser(getUser);
    };
    loadUser();
  }, [query.uid]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!body) {
      return;
    }

    setIsSending(true);

    await firebase.firestore().collection("questions").add({
      senderUid: firebase.auth().currentUser.uid,
      receiverUid: user.uid,
      body,
      isReplied: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setIsSending(false);

    setBody("");

    toast.success("質問を送信しました。", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Layout>
      {user && currentUser && (
        <>
          <div className="text-center">
            <h1 className="h4">{user.name}さんのページ</h1>
            <div className="m-5">{user.name}さんに質問しよう!</div>
            <div className="row justify-content-center mb-3">
              <div className="col-12 col-md-6">
                {user.uid === currentUser.uid ? (
                  <div>自分には送信できません。</div>
                ) : (
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
                        <div
                          className="spinner-border text-secondary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <button type="submit" className="btn btn-primary">
                            質問を送信する
                          </button>
                          <div>
                            {user && (
                              <p>
                                <Link href="/users/me">
                                  <a className="btn btn-link">
                                    自分もみんなに質問してもらおう！
                                  </a>
                                </Link>
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
