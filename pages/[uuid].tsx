import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistance } from "date-fns";
import styles from "../styles/Home.module.css";

export default function Document({ title, doc }: { title: string; doc: any }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          {doc.tags.title} / {title}
        </title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Link href={"/"}>{title}</Link>
        </h1>
        <h2>
          <Link href={`/${doc.uuid}`}>{doc.tags.title}</Link>
        </h2>
        <p>
          <Link href={`/${doc.uuid}`}>
            {formatDistance(new Date(doc.tags.date), new Date(), {
              addSuffix: true,
            })}
          </Link>
        </p>
        <hr />
        <div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params?.uuid) {
    return { notFound: true };
  }

  const uuid = Array.isArray(context.params.uuid)
    ? context.params.uuid[0]
    : context.params.uuid;

  const response = await fetch(
    `${process.env.GATEWAY_URL}/docs/${process.env.WALLET_ADDRESS}/${uuid}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();

  if (!json.body || json.body.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      title: process.env.TITLE,
      doc: json.body[0],
    },
  };
};
