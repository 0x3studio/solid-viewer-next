import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { formatDistance } from "date-fns";
import styles from "../styles/Home.module.css";

export default function Home({ title, docs }: { title: string; docs: any[] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Link href={"/"}>{title}</Link>
        </h1>
        <div>
          {docs.map((doc) => {
            return (
              <div key={doc.uuid}>
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
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(
    `${process.env.GATEWAY_URL}/docs/${process.env.WALLET_ADDRESS}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();

  return {
    props: {
      title: process.env.TITLE,
      docs: Object.values(json.body),
    },
  };
};
