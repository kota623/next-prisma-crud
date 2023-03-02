import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      await prisma.note.delete({
        where: {
          id: Number(req.body)
        }
      });
      res.status(200).json({ message: "Post Delete" });
    } catch (error) {
      console.log(error);
    }
  } else if (req.method === 'PUT') {
    const { title, post, id } = req.body
    try {
      await prisma.note.update({
        where: {
          id: id
        },
        data: {
          title,
          post
        }
      })
      res.status(200).json({ message: "Post updated" });
      
    } catch (error) {
        console.log(error)
      
    }
  }
}