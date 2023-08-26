import Head from "next/head";
import Link from "next/link";
// import Script from "next/script";
import Layout from "@/components/layout";
import { useState, useEffect } from "react";

export default function FirstPost() {
  const [text, setText] = useState("First Post");
  const [email, setEmail] = useState("");
  useEffect(() => {
    document.title = `change title: ${text}`;
  });

  function clickButton(text: string, email: string) {
    fetch("/api/hello", {
      method: "POST",
      body: JSON.stringify({ text: text, email: email }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setText(json.text);
        setEmail(json.email);
      });
  }

  return (
    <Layout home={false}>
      <Head>
        <title>First Post</title>
      </Head>
      {/*<Script*/}
      {/*  src="https://connect.facebook.net/en_US/sdk.js"*/}
      {/*  strategy="lazyOnload"*/}
      {/*  onLoad={() => {*/}
      {/*    console.log("script loaded correctly, window.FB has been populated");*/}
      {/*  }}*/}
      {/*/>*/}
      <h1>First Post</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
      <h3>text: {text}</h3>
      <h3>email: {email}</h3>
      <div className={"mt-10 flex items-center justify-center gap-x-6"}>
        <button
          type={"button"}
          className={
            "rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          }
          onClick={() => clickButton("aaa", "bbb@gmail.com")}
        >
          input text and email
        </button>
        <br />
        <button
          type={"button"}
          className={"text-sm font-semibold leading-6"}
          onClick={() => clickButton("", "")}
        >
          parameter none
        </button>
      </div>
    </Layout>
  );
}