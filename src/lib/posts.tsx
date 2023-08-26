import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/pages/posts");
const mysql = require("mysql");
const connection = mysql.createConnection({
  port: 3307,
  user: "root",
  password: "password",
  database: "testdb",
});
const loadFromFile = true;

export async function getSortedPostsData() {
  return loadFromFile ? getSortedPostsDataByFile() : getSortedPostsDataByDB();
}

// DBから取得する
async function getSortedPostsDataByDB() {
  console.log("getSortedPostsDataByDB");
  return new Promise<any>((resolve, reject) => {
    connection.query(
      "SELECT * FROM user ORDER BY id",
      (error: any, results: Array<any> /* , fields: Array<any> */) => {
        // console.log(error);
        // console.log(results);
        // console.log(fields);

        if (error) return reject();
        resolve(
          results.map((entity) => {
            return {
              id: entity.id,
              title: entity.name,
            };
          })
        );
      }
    );
  });
}

// ファイルから取得する
async function getSortedPostsDataByFile() {
  console.log("getSortedPostsDataByFile");
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: { [p: string]: any; id: string }[] = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });

  return new Promise((resolve) => {
    resolve(
      // Sort posts by date
      allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
    );
  });
}

export async function getPostData(id: string) {
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}