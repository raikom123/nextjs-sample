// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  text: string;
  email: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  const body = JSON.parse(req.body);
  const text = body.text || "input text";
  const email = body.email;
  res.status(200).json({ text: text, email: email });
}