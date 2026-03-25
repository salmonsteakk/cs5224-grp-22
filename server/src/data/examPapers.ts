import type { Question } from "../types/index.js";

export interface ExamPaperSeed {
  paperId: string;
  subjectId: "math" | "science";
  title: string;
  description: string;
  questions: Question[];
}

export const examPapers: ExamPaperSeed[] = [
  {
    paperId: "science-mock-1",
    subjectId: "science",
    title: "Science Mock Paper 1",
    description: "Mixed topics: life science, physical science, and earth science.",
    questions: [
      {
        id: "sci-m1-q1",
        question: "What do plants need to make their own food?",
        options: ["Only water", "Water, sunlight, and carbon dioxide", "Only soil", "Only oxygen"],
        correctAnswer: 1,
        explanation: "Photosynthesis uses water, carbon dioxide, and light energy to produce glucose.",
      },
      {
        id: "sci-m1-q2",
        question: "Which state of matter has a fixed volume but takes the shape of its container?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        correctAnswer: 1,
        explanation: "Liquids flow and match the container shape while keeping a nearly fixed volume.",
      },
      {
        id: "sci-m1-q3",
        question: "What is the main source of energy for Earth’s weather and climate?",
        options: ["The Moon", "The Sun", "Volcanoes", "Ocean currents only"],
        correctAnswer: 1,
        explanation: "Solar energy drives heating, winds, and the water cycle.",
      },
    ],
  },
  {
    paperId: "science-mock-2",
    subjectId: "science",
    title: "Science Mock Paper 2",
    description: "Another mixed practice paper with different questions.",
    questions: [
      {
        id: "sci-m2-q1",
        question: "Which organ system transports oxygen around the body?",
        options: ["Digestive", "Circulatory", "Skeletal", "Nervous"],
        correctAnswer: 1,
        explanation: "The circulatory system moves blood, which carries oxygen.",
      },
      {
        id: "sci-m2-q2",
        question: "A ball rolling on a flat floor slows down mainly because of",
        options: ["Gravity alone", "Friction", "Magnetism", "Buoyancy"],
        correctAnswer: 1,
        explanation: "Friction between the ball and the surface opposes motion.",
      },
      {
        id: "sci-m2-q3",
        question: "Which cycle describes how water moves between Earth’s surface and the atmosphere?",
        options: ["Rock cycle", "Carbon cycle", "Water cycle", "Nitrogen cycle"],
        correctAnswer: 2,
        explanation: "Evaporation, condensation, and precipitation form the water cycle.",
      },
    ],
  },
  {
    paperId: "math-mock-1",
    subjectId: "math",
    title: "Math Mock Paper 1",
    description: "Arithmetic and number sense in one consolidated paper.",
    questions: [
      {
        id: "math-m1-q1",
        question: "What is 48 ÷ 6?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "48 divided by 6 equals 8.",
      },
      {
        id: "math-m1-q2",
        question: "Which fraction is equivalent to 1/2?",
        options: ["2/5", "3/6", "1/3", "2/3"],
        correctAnswer: 1,
        explanation: "3/6 simplifies to 1/2.",
      },
      {
        id: "math-m1-q3",
        question: "Round 47 to the nearest ten.",
        options: ["40", "45", "50", "47"],
        correctAnswer: 2,
        explanation: "47 is closer to 50 than to 40.",
      },
    ],
  },
];
