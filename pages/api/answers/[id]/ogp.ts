import * as path from "path";
import { createCanvas, registerFont, loadImage } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "firebase-admin";
import { Answer } from "../../../../model/Answer";
import { Question } from "../../../../model/Questions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // 質問内容準備
  const id = req.query.id as string;
  const answerDoc = await firestore().collection("answers").doc(id).get();
  const answer = answerDoc.data() as Answer;
  const questionDoc = await firestore()
    .collection("questions")
    .doc(answer.questionId)
    .get();
  const question = questionDoc.data() as Question;

  // 画像準備
  const width = 600;
  const height = 315;
  registerFont(path.resolve("./fonts/ipaexg.ttf"), {
    family: "ipaexg",
  });
  const backgroundImages = await loadImage(
    path.resolve("./images/ogp_background.jpg")
  );
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.drawImage(backgroundImages, 0, 0, width, height);
  context.font = "20px ipaexg";
  context.fillStyle = "#424242";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const lines = createTextLines(context, question.body);
  lines.forEach((line, index) => {
    const y = 157 + 40 * (index - (lines.length - 1) / 2);
    context.fillText(line, 300, y);
  });

  const buffer = canvas.toBuffer();

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": buffer.length,
  });
  res.end(buffer, "binary");
};

type SeparatedText = {
  line: string;
  remaining: string;
};

const createTextLine = (context, text: string): SeparatedText => {
  const maxWidth = 400;

  for (let i = 0; i < text.length; i++) {
    const line = text.substring(0, i + 1);
    if (context.measureText(line).width > maxWidth) {
      return {
        line,
        remaining: text.substring(i + 1),
      };
    }
  }

  return {
    line: text,
    remaining: "",
  };
};

const createTextLines = (context, text: string): string[] => {
  const lines: string[] = [];
  let currentText = text;

  while (currentText !== "") {
    const separatedText = createTextLine(context, currentText);
    lines.push(separatedText.line);
    currentText = separatedText.remaining;
  }

  return lines;
};
