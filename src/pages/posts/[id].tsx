import Head from "next/head";
import Layout from "@/components/layout";
import Date from "@/components/date";
import { getSortedPostsData, getPostData } from "@/lib/posts";

// Generates `/posts/{markdown file name}`
export async function getStaticPaths() {
  const postData = await getSortedPostsData();
  return {
    paths: postData.map((post: { id: string; title: string }) => {
      return { params: { id: post.id } };
    }),
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  const post = await getPostData(context.params.id);

  return {
    // Passed to the page component as props
    props: { post },
  };
}

export default function Post({
  post,
}: {
  post: { title: string; date: string; contentHtml: string };
}) {
  return (
    <Layout home={false}>
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1 className={"text-3xl"}>{post.title}</h1>
      <div className={"py-6"}>
        <Date dateString={post.date} />
      </div>
      <h3
        className={"text-base"}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </Layout>
  );
}