import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, post } = req.body;
  try {
    await prisma.note.create({
      data: {
        title,
        post,
      },
    });
    res.status(200).json({ message: "Post created" });
  } catch (error) {
    console.log(error);
  }
}