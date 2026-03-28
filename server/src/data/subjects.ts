import type { Subject, Topic } from "../types/index.js";

const mathTopics: Topic[] = [
  {
    id: "number-algebra",
    title: "Number and Algebra (Whole Numbers)",
    description:
      "Factors, multiples, primes, LCM, HCF, and number patterns—without drill on basic +/−/×/÷ facts alone",
    icon: "Hash",
    lessons: [
      {
        id: "na-1",
        title: "Factors, multiples, and primes",
        description: "Find common factors, test divisibility, and recognise prime and composite numbers",
        videoUrl: "/videos/math/number-algebra-na-1.mp4",
        duration: "6:00",
      },
      {
        id: "na-2",
        title: "HCF and LCM in context",
        description: "Use highest common factor and lowest common multiple to solve packing and repeat-event problems",
        videoUrl: "/videos/math/number-algebra-na-2.mp4",
        duration: "7:15",
      },
      {
        id: "na-3",
        title: "Place value and estimation",
        description: "Round sensibly and explain when an estimate is enough for a real-world decision",
        videoUrl: "/videos/math/number-algebra-na-3.mp4",
        duration: "5:45",
      },
    ],
    questions: [
      {
        id: "na-q1",
        question: "Which of these is a common factor of both 24 and 36?",
        options: ["7", "8", "9", "12"],
        correctAnswer: 3,
        explanation: "12 divides both 24 and 36; 7, 8, and 9 fail for at least one of the two numbers.",
      },
      {
        id: "na-q2",
        question: "What is the lowest common multiple (LCM) of 6 and 8?",
        options: ["16", "24", "48", "72"],
        correctAnswer: 1,
        explanation: "The smallest positive multiple shared by 6 and 8 is 24.",
      },
      {
        id: "na-q3",
        question: "Which number is a prime?",
        options: ["49", "51", "53", "57"],
        correctAnswer: 2,
        explanation: "53 has no positive divisors other than 1 and itself; 49 = 7×7, 51 = 3×17, 57 = 3×19.",
      },
      {
        id: "na-q4",
        question:
          "Two bells ring together, then every 12 minutes and every 18 minutes respectively. After how many minutes will they next ring together?",
        options: ["24 minutes", "30 minutes", "36 minutes", "72 minutes"],
        correctAnswer: 2,
        explanation: "The next common time is LCM(12, 18) = 36 minutes.",
      },
      {
        id: "na-q5",
        question: "What is the highest common factor (HCF) of 48 and 72?",
        options: ["12", "16", "24", "36"],
        correctAnswer: 2,
        explanation: "48 = 24×2 and 72 = 24×3; 24 is the largest shared factor.",
      },
      {
        id: "na-q6",
        question:
          "A charity packs identical gift bags. They have 54 pens and 90 notebooks and want the largest possible bag count with no leftovers. How many bags can they make?",
        options: ["6 bags", "9 bags", "18 bags", "27 bags"],
        correctAnswer: 2,
        explanation: "HCF(54, 90) = 18, so 18 identical bags use all items evenly.",
      },
    ],
  },
  {
    id: "fractions-decimals-percent",
    title: "Fractions, Decimals, and Percentages",
    description: "Convert between forms and apply them in comparison and problem sums",
    icon: "Percent",
    lessons: [
      {
        id: "fdp-1",
        title: "Equivalent forms",
        description: "Move confidently among fractions, terminating decimals, and percentages",
        videoUrl: "/videos/math/fractions-decimals-percent-fdp-1.mp4",
        duration: "6:30",
      },
      {
        id: "fdp-2",
        title: "Comparing and ordering",
        description: "Use a common form to decide which quantity is larger in context",
        videoUrl: "/videos/math/fractions-decimals-percent-fdp-2.mp4",
        duration: "7:00",
      },
      {
        id: "fdp-3",
        title: "Discounts, tax, and change",
        description: "Model percentage increase and decrease on money amounts",
        videoUrl: "/videos/math/fractions-decimals-percent-fdp-3.mp4",
        duration: "8:10",
      },
    ],
    questions: [
      {
        id: "fdp-q1",
        question: "Which decimal is equal to three-quarters?",
        options: ["0.25", "0.5", "0.75", "0.8"],
        correctAnswer: 2,
        explanation: "3/4 = 0.75.",
      },
      {
        id: "fdp-q2",
        question: "45% written as a fraction in its simplest form is:",
        options: ["9/20", "45/100", "1/2", "2/5"],
        correctAnswer: 0,
        explanation: "45% = 45/100 = 9/20 after dividing numerator and denominator by 5.",
      },
      {
        id: "fdp-q3",
        question: "A jacket costs $80 before a 15% store discount. What is the sale price?",
        options: ["$65", "$68", "$72", "$76"],
        correctAnswer: 1,
        explanation: "15% of 80 = 12, so 80 − 12 = $68.",
      },
      {
        id: "fdp-q4",
        question: "Which value is the greatest?",
        options: ["3/5", "62%", "0.59", "7/12"],
        correctAnswer: 1,
        explanation: "As decimals: 0.6, 0.62, 0.59, ≈0.583; 62% is largest.",
      },
      {
        id: "fdp-q5",
        question:
          "After a 20% price increase, a bus fare is $1.20. What was the fare before the increase?",
        options: ["$0.96", "$1.00", "$1.04", "$1.10"],
        correctAnswer: 1,
        explanation: "New = 1.2 × old, so old = 1.20 ÷ 1.2 = $1.00.",
      },
      {
        id: "fdp-q6",
        question: "0.035 expressed as a percentage is:",
        options: ["0.35%", "3.5%", "35%", "350%"],
        correctAnswer: 1,
        explanation: "Multiply by 100: 0.035 → 3.5%.",
      },
    ],
  },
  {
    id: "ratio",
    title: "Ratio",
    description: "Equivalent ratios, sharing a quantity, and simple scale problems",
    icon: "Scale",
    lessons: [
      {
        id: "ratio-1",
        title: "Equivalent ratios",
        description: "Scale ratios up and down while keeping the same relationship",
        videoUrl: "/videos/math/ratio-ratio-1.mp4",
        duration: "5:40",
      },
      {
        id: "ratio-2",
        title: "Dividing a quantity in a given ratio",
        description: "Split totals into parts that add back to the whole",
        videoUrl: "/videos/math/ratio-ratio-2.mp4",
        duration: "7:20",
      },
      {
        id: "ratio-3",
        title: "Ratio and fractions",
        description: "Express one part as a fraction of the whole or of another part",
        videoUrl: "/videos/math/ratio-ratio-3.mp4",
        duration: "6:15",
      },
    ],
    questions: [
      {
        id: "ratio-q1",
        question: "The ratio 2 : 5 is equivalent to which ratio?",
        options: ["4 : 9", "6 : 20", "8 : 20", "10 : 12"],
        correctAnswer: 2,
        explanation: "Multiply both parts by 4: 2×4 : 5×4 = 8 : 20.",
      },
      {
        id: "ratio-q2",
        question:
          "Purple paint mixes blue and red in the ratio 3 : 2. How many litres of blue are needed for 10 litres of red?",
        options: ["12 L", "15 L", "18 L", "20 L"],
        correctAnswer: 1,
        explanation: "Blue/red = 3/2, so blue = (3/2)×10 = 15 L.",
      },
      {
        id: "ratio-q3",
        question: "Simplify the ratio 18 : 24 to its lowest terms.",
        options: ["2 : 3", "3 : 4", "6 : 8", "9 : 12"],
        correctAnswer: 1,
        explanation: "Divide both parts by HCF(18, 24) = 6 → 3 : 4.",
      },
      {
        id: "ratio-q4",
        question:
          "$200 is shared between Ali and Beth in the ratio 3 : 5. How much more does Beth receive than Ali?",
        options: ["$25", "$40", "$50", "$75"],
        correctAnswer: 2,
        explanation: "Ali gets (3/8)×200 = 75, Beth (5/8)×200 = 125; difference 50.",
      },
      {
        id: "ratio-q5",
        question:
          "On a map, 1 cm represents 4 km. Two towns are 22 km apart in real life. How far apart are they on the map?",
        options: ["4.5 cm", "5.0 cm", "5.5 cm", "8.8 cm"],
        correctAnswer: 2,
        explanation: "22 ÷ 4 = 5.5 cm.",
      },
      {
        id: "ratio-q6",
        question:
          "The angles in a triangle are in the ratio 2 : 3 : 4. What is the size of the largest angle?",
        options: ["60°", "72°", "80°", "90°"],
        correctAnswer: 2,
        explanation: "Sum of ratio parts = 9; 180° ÷ 9 = 20° per part; largest = 4×20° = 80°.",
      },
    ],
  },
  {
    id: "algebra",
    title: "Algebra",
    description: "Unknowns, simplifying expressions, and basic linear equations",
    icon: "Variable",
    lessons: [
      {
        id: "alg-1",
        title: "Letters for unknowns",
        description: "Translate phrases like “a number increased by five” into algebra",
        videoUrl: "/videos/math/algebra-alg-1.mp4",
        duration: "6:00",
      },
      {
        id: "alg-2",
        title: "Simplifying expressions",
        description: "Collect like terms and substitute values carefully",
        videoUrl: "/videos/math/algebra-alg-2.mp4",
        duration: "6:45",
      },
      {
        id: "alg-3",
        title: "Linear equations",
        description: "Solve ax + b = c where a, b, c are small integers",
        videoUrl: "/videos/math/algebra-alg-3.mp4",
        duration: "7:30",
      },
    ],
    questions: [
      {
        id: "alg-q1",
        question: "If 4m − 7 = 21, what is the value of m?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "4m = 28, so m = 7.",
      },
      {
        id: "alg-q2",
        question: "Simplify 8p − 3p + 2p.",
        options: ["3p", "5p", "7p", "13p"],
        correctAnswer: 2,
        explanation: "(8 − 3 + 2)p = 7p.",
      },
      {
        id: "alg-q3",
        question:
          "The perimeter of a rectangle is 34 cm. Its length is (x + 3) cm and its width is x cm. What is x?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "2(2x + 3) = 34 → 4x + 6 = 34 → 4x = 28 → x = 7.",
      },
      {
        id: "alg-q4",
        question: "Which expression equals “5 less than twice y”?",
        options: ["5 − 2y", "2y − 5", "2(y − 5)", "5y − 2"],
        correctAnswer: 1,
        explanation: "Twice y is 2y; five less is 2y − 5.",
      },
      {
        id: "alg-q5",
        question: "If n = 6, what is the value of 3n² − 2n?",
        options: ["96", "102", "106", "114"],
        correctAnswer: 0,
        explanation: "3(36) − 12 = 108 − 12 = 96.",
      },
      {
        id: "alg-q6",
        question: "What value of x satisfies 2(x + 1) = 16?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "x + 1 = 8, so x = 7.",
      },
    ],
  },
  {
    id: "average",
    title: "Average (Mean)",
    description: "Calculate means and work backwards when one value is unknown",
    icon: "BarChart3",
    lessons: [
      {
        id: "avg-1",
        title: "Mean of a data set",
        description: "Total ÷ count; interpret the mean as a fair-share value",
        videoUrl: "/videos/math/average-avg-1.mp4",
        duration: "5:30",
      },
      {
        id: "avg-2",
        title: "Missing data values",
        description: "Use the mean to find an unknown score or measurement",
        videoUrl: "/videos/math/average-avg-2.mp4",
        duration: "6:40",
      },
      {
        id: "avg-3",
        title: "Combining groups",
        description: "Reason about averages when groups merge or weights differ",
        videoUrl: "/videos/math/average-avg-3.mp4",
        duration: "7:00",
      },
    ],
    questions: [
      {
        id: "avg-q1",
        question: "What is the mean of 14, 22, 18, and 26?",
        options: ["18", "19", "20", "21"],
        correctAnswer: 2,
        explanation: "Sum = 80; 80 ÷ 4 = 20.",
      },
      {
        id: "avg-q2",
        question:
          "Jamal’s mean score over four quizzes is 76. After a fifth quiz, his mean rises to 80. What was his fifth quiz score?",
        options: ["84", "88", "92", "96"],
        correctAnswer: 3,
        explanation: "Total after five = 5×80 = 400; first four total = 4×76 = 304; fifth = 400 − 304 = 96.",
      },
      {
        id: "avg-q3",
        question: "The mean of 12, 20, and k is 18. What is k?",
        options: ["20", "22", "24", "26"],
        correctAnswer: 1,
        explanation: "(12 + 20 + k)/3 = 18 → 32 + k = 54 → k = 22.",
      },
      {
        id: "avg-q4",
        question:
          "A swimmer’s times in seconds for five laps are 48, 52, 50, 54, and one missing lap. The mean time is 51 s. What was the missing time?",
        options: ["49 s", "51 s", "53 s", "55 s"],
        correctAnswer: 1,
        explanation: "Five-lap total = 5×51 = 255; known sum = 204; missing = 51 s.",
      },
      {
        id: "avg-q5",
        question:
          "Class A has 10 pupils with mean mass 40 kg. Class B has 15 pupils with mean mass 44 kg. What is the mean mass of all 25 pupils?",
        options: ["41.2 kg", "42.0 kg", "42.4 kg", "43.0 kg"],
        correctAnswer: 2,
        explanation: "Total mass = 10×40 + 15×44 = 400 + 660 = 1060; 1060 ÷ 25 = 42.4 kg.",
      },
      {
        id: "avg-q6",
        question:
          "The average of seven numbers is 15. If an eighth number 23 is added, what is the new average?",
        options: ["15.5", "16", "16.5", "17"],
        correctAnswer: 1,
        explanation: "Original sum = 7×15 = 105; new sum = 128; 128 ÷ 8 = 16.",
      },
    ],
  },
  {
    id: "measurement",
    title: "Measurement",
    description: "Length, mass, time (12 h / 24 h), money, area, perimeter, volume of cubes and cuboids",
    icon: "Ruler",
    lessons: [
      {
        id: "meas-1",
        title: "Compound units and conversion",
        description: "Switch between cm and m, g and kg, and read clocks in 12 h and 24 h",
        videoUrl: "/videos/math/measurement-meas-1.mp4",
        duration: "6:20",
      },
      {
        id: "meas-2",
        title: "Area and perimeter",
        description: "Rectangles, composite figures, and choosing correct units",
        videoUrl: "/videos/math/measurement-meas-2.mp4",
        duration: "7:10",
      },
      {
        id: "meas-3",
        title: "Volume of cuboids",
        description: "Relate layers of unit cubes to length × width × height",
        videoUrl: "/videos/math/measurement-meas-3.mp4",
        duration: "6:45",
      },
    ],
    questions: [
      {
        id: "meas-q1",
        question: "A rectangular field is 45 m long and 28 m wide. What is its area?",
        options: ["980 m²", "1160 m²", "1260 m²", "1460 m²"],
        correctAnswer: 2,
        explanation: "45 × 28 = 1260 m².",
      },
      {
        id: "meas-q2",
        question: "A cuboid measures 6 cm by 5 cm by 4 cm. What is its volume?",
        options: ["100 cm³", "110 cm³", "120 cm³", "150 cm³"],
        correctAnswer: 2,
        explanation: "6 × 5 × 4 = 120 cm³.",
      },
      {
        id: "meas-q3",
        question: "How many minutes are there from 09:40 to 11:05 on the same morning?",
        options: ["75 minutes", "85 minutes", "95 minutes", "105 minutes"],
        correctAnswer: 1,
        explanation: "From 09:40 to 11:05 is 1 h 25 min = 85 minutes.",
      },
      {
        id: "meas-q4",
        question: "In 24-hour time, half past two in the afternoon is written as:",
        options: ["02:30", "12:30", "14:30", "15:30"],
        correctAnswer: 2,
        explanation: "2:30 p.m. = 14:30 in 24-hour notation.",
      },
      {
        id: "meas-q5",
        question:
          "A square garden has side length 12.5 m. Fencing costs $8 per metre. What is the total cost to fence the perimeter once?",
        options: ["$380", "$400", "$420", "$440"],
        correctAnswer: 1,
        explanation: "Perimeter = 4 × 12.5 = 50 m; 50 × 8 = $400.",
      },
      {
        id: "meas-q6",
        question: "Express 2.45 kg + 800 g in kilograms.",
        options: ["2.53 kg", "3.25 kg", "3.45 kg", "10.45 kg"],
        correctAnswer: 1,
        explanation: "800 g = 0.8 kg; 2.45 + 0.8 = 3.25 kg.",
      },
    ],
  },
  {
    id: "geometry",
    title: "Geometry",
    description: "Angles, triangles, quadrilaterals, and circles (area and circumference)",
    icon: "Triangle",
    lessons: [
      {
        id: "geo-1",
        title: "Angles and parallel lines",
        description: "Complementary, supplementary, and angles in parallel-line diagrams",
        videoUrl: "/videos/math/geometry-geo-1.mp4",
        duration: "6:50",
      },
      {
        id: "geo-2",
        title: "Triangles and quadrilaterals",
        description: "Angle sums, symmetry, and special properties",
        videoUrl: "/videos/math/geometry-geo-2.mp4",
        duration: "7:00",
      },
      {
        id: "geo-3",
        title: "Circles",
        description: "Radius, diameter, circumference, and area using π",
        videoUrl: "/videos/math/geometry-geo-3.mp4",
        duration: "7:30",
      },
    ],
    questions: [
      {
        id: "geo-q1",
        question: "Two angles of a triangle are 41° and 67°. What is the third angle?",
        options: ["70°", "72°", "74°", "82°"],
        correctAnswer: 1,
        explanation: "180° − 41° − 67° = 72°.",
      },
      {
        id: "geo-q2",
        question: "Take π = 22/7. What is the circumference of a circle of radius 14 cm?",
        options: ["44 cm", "66 cm", "88 cm", "154 cm"],
        correctAnswer: 2,
        explanation: "C = 2πr = 2 × (22/7) × 14 = 88 cm.",
      },
      {
        id: "geo-q3",
        question: "Take π = 3.14. What is the area of a circle of diameter 10 cm?",
        options: ["31.4 cm²", "62.8 cm²", "78.5 cm²", "157 cm²"],
        correctAnswer: 2,
        explanation: "r = 5 cm; area = πr² = 3.14 × 25 = 78.5 cm².",
      },
      {
        id: "geo-q4",
        question:
          "In a pair of parallel lines cut by a transversal, one interior angle on the same side measures 118°. Its co-interior partner on the same side of the transversal measures:",
        options: ["52°", "62°", "72°", "118°"],
        correctAnswer: 1,
        explanation: "Co-interior angles between parallels are supplementary: 180° − 118° = 62°.",
      },
      {
        id: "geo-q5",
        question: "An isosceles triangle has a vertex angle of 40°. Each base angle is:",
        options: ["40°", "60°", "70°", "80°"],
        correctAnswer: 2,
        explanation: "Base angles sum to 140°; each is 70°.",
      },
      {
        id: "geo-q6",
        question:
          "A semicircle has radius 10 cm (straight diameter included in the boundary). Take π = 3.14. What is the total length of the boundary (curved part + diameter)?",
        options: ["25.7 cm", "41.4 cm", "51.4 cm", "62.8 cm"],
        correctAnswer: 2,
        explanation: "Half circumference = πr = 31.4 cm; plus diameter 20 cm → 51.4 cm.",
      },
    ],
  },
  {
    id: "nets",
    title: "Nets of Solids",
    description: "Match 2D nets to cubes, cuboids, and common prisms and pyramids",
    icon: "Box",
    lessons: [
      {
        id: "net-1",
        title: "Cube nets",
        description: "Rules for which arrangements of six squares fold into a closed cube",
        videoUrl: "/videos/math/nets-net-1.mp4",
        duration: "5:50",
      },
      {
        id: "net-2",
        title: "Cuboids and prisms",
        description: "Rectangular faces in nets and how edges meet",
        videoUrl: "/videos/math/nets-net-2.mp4",
        duration: "6:30",
      },
      {
        id: "net-3",
        title: "Pyramids and cylinders (ideas)",
        description: "Describe nets in words: triangles around a base, rectangle plus circles",
        videoUrl: "/videos/math/nets-net-3.mp4",
        duration: "6:10",
      },
    ],
    questions: [
      {
        id: "net-q1",
        question: "A standard cube net is made only of squares. How many square faces appear in any valid cube net?",
        options: ["4", "5", "6", "8"],
        correctAnswer: 2,
        explanation: "A cube has six faces, so its net shows six squares.",
      },
      {
        id: "net-q2",
        question:
          "Which statement about cube nets is true?",
        options: [
          "Any six squares drawn in a row always form a cube net",
          "A cube net never has more than four squares in a single straight line",
          "Two squares in a cube net can share more than one full edge when flat",
          "A cube net must contain exactly one row of four squares in some layouts",
        ],
        correctAnswer: 1,
        explanation: "Valid nets cannot have five or six collinear squares; at most four in one row.",
      },
      {
        id: "net-q3",
        question:
          "The net of a closed cuboid (not a cube) with all faces rectangular has how many rectangular regions in the net?",
        options: ["4", "5", "6", "8"],
        correctAnswer: 2,
        explanation: "A cuboid has six rectangular faces, so six regions in the net.",
      },
      {
        id: "net-q4",
        question:
          "When a closed square-based pyramid is cut along enough edges and laid flat, how many triangular faces appear in its net besides the square base?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "A square base has four triangular side faces.",
      },
      {
        id: "net-q5",
        question:
          "Which arrangement cannot fold into a closed cube? (Imagine the squares edge-to-edge in one row only.)",
        options: [
          "Six squares in one long straight strip",
          "A cross-shaped net with a central square",
          "A ‘T’ shape made of six squares that matches a known cube net",
          "Four squares in a row with one square attached above the second from the left",
        ],
        correctAnswer: 0,
        explanation: "Six squares in a single straight line cannot fold into a cube without overlaps or gaps.",
      },
      {
        id: "net-q6",
        question:
          "A right circular cylinder’s net consists of one rectangle and how many circles?",
        options: ["0", "1", "2", "3"],
        correctAnswer: 2,
        explanation: "Top and bottom caps are circles, so two circles plus the curved rectangular surface.",
      },
    ],
  },
  {
    id: "statistics",
    title: "Statistics (Data Analysis)",
    description: "Read tables, bar graphs, line graphs, and pie charts",
    icon: "PieChart",
    lessons: [
      {
        id: "stat-1",
        title: "Tables and bar graphs",
        description: "Compare categories and totals from labelled axes",
        videoUrl: "/videos/math/statistics-stat-1.mp4",
        duration: "5:45",
      },
      {
        id: "stat-2",
        title: "Line graphs",
        description: "Describe increase, decrease, and rate of change over time",
        videoUrl: "/videos/math/statistics-stat-2.mp4",
        duration: "6:15",
      },
      {
        id: "stat-3",
        title: "Pie charts",
        description: "Relate sector angles or fractions to the whole 100%",
        videoUrl: "/videos/math/statistics-stat-3.mp4",
        duration: "6:30",
      },
    ],
    questions: [
      {
        id: "stat-q1",
        question:
          "A pie chart shows transport: Bus 40%, MRT 35%, Walk 25%. What fraction of pupils walk?",
        options: ["1/5", "1/4", "1/3", "2/5"],
        correctAnswer: 1,
        explanation: "25% = 1/4.",
      },
      {
        id: "stat-q2",
        question:
          "The table shows books borrowed: Mon 42, Tue 55, Wed 48, Thu 60. On which day were the fewest books borrowed?",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        correctAnswer: 0,
        explanation: "42 is the smallest count (Monday).",
      },
      {
        id: "stat-q3",
        question:
          "A line graph of temperature rises steeply from 8 a.m. to noon, then levels off. Which phrase best describes noon to 2 p.m.?",
        options: [
          "Temperature dropped quickly",
          "Temperature stayed about the same",
          "Temperature doubled every hour",
          "The graph cannot show temperature",
        ],
        correctAnswer: 1,
        explanation: "Levelling off means little change over that interval.",
      },
      {
        id: "stat-q4",
        question:
          "In a bar graph of sales, Drink A’s bar reaches 120 units and Drink B’s reaches 90 units. How many more units of A than B were sold?",
        options: ["20", "25", "30", "35"],
        correctAnswer: 2,
        explanation: "120 − 90 = 30.",
      },
      {
        id: "stat-q5",
        question:
          "A full pie chart represents 240 people. A sector marked 90° shows people who chose “Drama”. How many people is that?",
        options: ["40", "50", "60", "80"],
        correctAnswer: 2,
        explanation: "90°/360° = 1/4 of 240 = 60.",
      },
      {
        id: "stat-q6",
        question:
          "A misleading graph might show a small increase looking huge because the vertical axis ___.",
        options: [
          "Starts at zero and uses equal spacing",
          "Does not start at zero or uses a broken scale",
          "Labels both axes clearly",
          "Uses a pie chart instead of a bar chart",
        ],
        correctAnswer: 1,
        explanation: "Truncated or uneven axes exaggerate small differences.",
      },
    ],
  },
];

const scienceTopics: Topic[] = [
  {
    id: "diversity",
    title: "Diversity",
    description: "Living and non-living things and everyday materials (P3)",
    icon: "Boxes",
    lessons: [
      {
        id: "div-1",
        title: "Living versus non-living",
        description: "Use movement, growth, reproduction, and response to decide",
        videoUrl: "/videos/science/diversity-div-1.mp4",
        duration: "5:40",
      },
      {
        id: "div-2",
        title: "Grouping plants and animals",
        description: "Observable features used in simple classification",
        videoUrl: "/videos/science/diversity-div-2.mp4",
        duration: "6:10",
      },
      {
        id: "div-3",
        title: "Materials around us",
        description: "Metal, plastic, glass, wood—properties and uses",
        videoUrl: "/videos/science/diversity-div-3.mp4",
        duration: "6:00",
      },
    ],
    questions: [
      {
        id: "div-q1",
        question:
          "Which set best lists characteristics more typical of living things than of a rock?",
        options: [
          "Being hard and shiny",
          "Growth, reproduction, and response to stimuli",
          "Staying the same size forever",
          "Conducting electricity",
        ],
        correctAnswer: 1,
        explanation: "Living things grow, reproduce, and respond; a rock does not in the biological sense.",
      },
      {
        id: "div-q2",
        question:
          "Why is a plastic ruler usually classed as non-living even though we use it daily?",
        options: [
          "It is too light",
          "It does not show life processes such as growth and reproduction on its own",
          "It is not solid",
          "It cannot conduct heat",
        ],
        correctAnswer: 1,
        explanation: "Non-living objects lack biological life processes.",
      },
      {
        id: "div-q3",
        question:
          "Which material is generally best described as malleable (can be hammered into sheets) and a good conductor of electricity?",
        options: ["Glass", "Wood", "Copper", "Rubber"],
        correctAnswer: 2,
        explanation: "Metals such as copper are malleable and conduct electricity well.",
      },
      {
        id: "div-q4",
        question:
          "In simple primary classification, which feature most clearly separates most plants from most animals?",
        options: [
          "Plants are always larger",
          "Plants usually make their own food using sunlight; animals must eat other organisms",
          "Animals never have cells",
          "Plants cannot live on land",
        ],
        correctAnswer: 1,
        explanation: "Autotrophy via photosynthesis is a key plant–animal distinction at this level.",
      },
      {
        id: "div-q5",
        question: "Which object is non-living?",
        options: ["Yeast cell", "Mushroom", "Seaweed", "Ceramic mug"],
        correctAnswer: 3,
        explanation: "A ceramic mug is human-made and does not carry out life processes.",
      },
      {
        id: "div-q6",
        question:
          "Why might we group sponges and cloth towels together for a “absorbs water” sort, but not for “living things”?",
        options: [
          "Both are alive",
          "Both are metals",
          "Both absorb water, but only one is living",
          "Neither can get wet",
        ],
        correctAnswer: 2,
        explanation: "Shared physical property does not mean both are alive.",
      },
    ],
  },
  {
    id: "cycles",
    title: "Cycles",
    description: "Life cycles, matter (water states), and the water cycle (P4–P5)",
    icon: "RefreshCw",
    lessons: [
      {
        id: "cyc-1",
        title: "Plant and animal life cycles",
        description: "Stages from seed or egg to adult and the next generation",
        videoUrl: "/videos/science/cycles-cyc-1.mp4",
        duration: "6:20",
      },
      {
        id: "cyc-2",
        title: "States of matter (water)",
        description: "Melting, freezing, evaporation, and condensation in everyday contexts",
        videoUrl: "/videos/science/cycles-cyc-2.mp4",
        duration: "6:45",
      },
      {
        id: "cyc-3",
        title: "The water cycle",
        description: "Evaporation, transpiration, condensation, precipitation, and collection",
        videoUrl: "/videos/science/cycles-cyc-3.mp4",
        duration: "7:10",
      },
    ],
    questions: [
      {
        id: "cyc-q1",
        question:
          "In the water cycle, water vapour in the air cooling into droplets on dust to form clouds is mainly called:",
        options: ["Evaporation", "Condensation", "Precipitation", "Runoff"],
        correctAnswer: 1,
        explanation: "Gas to liquid droplets in the air is condensation.",
      },
      {
        id: "cyc-q2",
        question:
          "Which change is melting?",
        options: [
          "Liquid water turning to ice",
          "Ice turning to liquid water",
          "Water turning to invisible vapour",
          "Vapour forming frost on grass",
        ],
        correctAnswer: 1,
        explanation: "Melting is solid → liquid (ice to water).",
      },
      {
        id: "cyc-q3",
        question:
          "In a butterfly’s life cycle, the stage where the organism is usually inactive inside a protective case is the:",
        options: ["Egg", "Larva", "Pupa", "Adult"],
        correctAnswer: 2,
        explanation: "The pupa (chrysalis) is the transformation stage.",
      },
      {
        id: "cyc-q4",
        question:
          "Plants release water vapour from leaves into the air. This contribution to the water cycle is called:",
        options: ["Infiltration", "Transpiration", "Sublimation", "Percolation"],
        correctAnswer: 1,
        explanation: "Transpiration is water loss from plant surfaces.",
      },
      {
        id: "cyc-q5",
        question:
          "Rain falling into a river, then flowing to the sea, is best labelled as:",
        options: ["Condensation", "Evaporation", "Collection and runoff", "Photosynthesis"],
        correctAnswer: 2,
        explanation: "Surface flow to oceans is runoff/collection pathways in the cycle.",
      },
      {
        id: "cyc-q6",
        question:
          "Frog development often shows egg → tadpole → adult frog. This sequence illustrates:",
        options: ["A food chain", "A life cycle", "A circuit", "A lever system"],
        correctAnswer: 1,
        explanation: "Repeated stages across generations describe a life cycle.",
      },
    ],
  },
  {
    id: "systems",
    title: "Systems",
    description: "Human body systems, plant transport, and simple electrical circuits (P4–P5)",
    icon: "CircuitBoard",
    lessons: [
      {
        id: "sys-1",
        title: "Human respiratory and circulatory ideas",
        description: "Gas exchange and blood moving oxygen and nutrients",
        videoUrl: "/videos/science/systems-sys-1.mp4",
        duration: "7:00",
      },
      {
        id: "sys-2",
        title: "Digestion and plant transport",
        description: "Breaking down food; xylem and phloem roles",
        videoUrl: "/videos/science/systems-sys-2.mp4",
        duration: "6:50",
      },
      {
        id: "sys-3",
        title: "Electrical circuits",
        description: "Cells, wires, bulbs, switches, and series behaviour",
        videoUrl: "/videos/science/systems-sys-3.mp4",
        duration: "6:30",
      },
    ],
    questions: [
      {
        id: "sys-q1",
        question:
          "In humans, gas exchange (oxygen in, carbon dioxide out) between air and blood happens mainly in the:",
        options: ["Trachea only", "Alveoli of the lungs", "Stomach", "Kidneys"],
        correctAnswer: 1,
        explanation: "Alveoli provide a large, thin surface for diffusion.",
      },
      {
        id: "sys-q2",
        question:
          "Which vessel carries blood away from the heart to the body (general rule)?",
        options: ["Vein", "Artery", "Capillary only", "Valve"],
        correctAnswer: 1,
        explanation: "Arteries carry blood away from the heart (pulmonary artery is the lung exception).",
      },
      {
        id: "sys-q3",
        question:
          "In plants, which tissue mainly moves sugars made in leaves to roots and fruits?",
        options: ["Xylem", "Phloem", "Stomata", "Cuticle"],
        correctAnswer: 1,
        explanation: "Phloem transports sugars (organic nutrients).",
      },
      {
        id: "sys-q4",
        question:
          "In a simple series circuit with one cell, one bulb, and a closed switch, if the bulb filament breaks, what happens?",
        options: [
          "The cell doubles in voltage",
          "Current stops and the bulb goes out",
          "The switch heats up instead",
          "Another hidden bulb lights",
        ],
        correctAnswer: 1,
        explanation: "A break in the loop stops current in a series circuit.",
      },
      {
        id: "sys-q5",
        question:
          "Which organ system is mainly responsible for mechanical and chemical breakdown of food?",
        options: ["Respiratory", "Digestive", "Nervous", "Skeletal"],
        correctAnswer: 1,
        explanation: "The digestive system processes food for absorption.",
      },
      {
        id: "sys-q6",
        question:
          "Opening or closing a switch in a circuit is analogous to:",
        options: [
          "Adding more water to a plant",
          "Completing or breaking a conducting path",
          "Increasing friction on a slope",
          "Changing the Moon’s phase",
        ],
        correctAnswer: 1,
        explanation: "A switch controls whether the circuit path is complete.",
      },
    ],
  },
  {
    id: "interactions",
    title: "Interactions",
    description: "Ecosystems, food chains and webs, adaptations, and forces (P6)",
    icon: "Globe2",
    lessons: [
      {
        id: "int-1",
        title: "Food chains and food webs",
        description: "Producers, consumers, and where energy is lost",
        videoUrl: "/videos/science/interactions-int-1.mp4",
        duration: "6:40",
      },
      {
        id: "int-2",
        title: "Adaptations",
        description: "Structures and behaviours that improve survival in a habitat",
        videoUrl: "/videos/science/interactions-int-2.mp4",
        duration: "6:15",
      },
      {
        id: "int-3",
        title: "Forces: friction, gravity, magnetism",
        description: "How motion and attraction change in everyday situations",
        videoUrl: "/videos/science/interactions-int-3.mp4",
        duration: "7:00",
      },
    ],
    questions: [
      {
        id: "int-q1",
        question:
          "In a food chain grass → grasshopper → frog → snake, which organism is a primary consumer?",
        options: ["Grass", "Grasshopper", "Frog", "Snake"],
        correctAnswer: 1,
        explanation: "Primary consumers eat producers; the grasshopper eats grass.",
      },
      {
        id: "int-q2",
        question:
          "Compared with a simple food chain, a food web is better at showing:",
        options: [
          "Only one predator",
          "Multiple feeding relationships among species",
          "That energy increases at each level",
          "That producers eat consumers",
        ],
        correctAnswer: 1,
        explanation: "Food webs link many chains and alternative food sources.",
      },
      {
        id: "int-q3",
        question:
          "A polar bear’s thick fur and fat layer are mainly:",
        options: ["Learned habits", "Adaptations for cold", "Types of seeds", "Electrical insulators only"],
        correctAnswer: 1,
        explanation: "Inherited traits that reduce heat loss help survival in cold habitats.",
      },
      {
        id: "int-q4",
        question:
          "Rougher shoe soles on a wet floor increase friction so you are less likely to slip because:",
        options: [
          "Gravity is turned off",
          "The grip between sole and floor increases",
          "Your mass becomes zero",
          "Friction always removes water completely",
        ],
        correctAnswer: 1,
        explanation: "Rougher contact surfaces increase friction opposing sliding.",
      },
      {
        id: "int-q5",
        question:
          "Which force pulls a falling apple toward Earth even when no one is touching it?",
        options: ["Magnetic force only", "Frictional force", "Gravitational force", "Buoyant force only"],
        correctAnswer: 2,
        explanation: "Weight is due to gravity toward Earth’s centre.",
      },
      {
        id: "int-q6",
        question:
          "Unlike poles of two bar magnets placed nearby tend to:",
        options: ["Repel", "Attract", "Cancel gravity", "Generate light"],
        correctAnswer: 1,
        explanation: "Opposite magnetic poles attract.",
      },
    ],
  },
  {
    id: "energy",
    title: "Energy",
    description: "Heat, light, photosynthesis, and energy conversions (P4–P6)",
    icon: "Zap",
    lessons: [
      {
        id: "en-1",
        title: "Heat and temperature",
        description: "Conduction, convection, radiation in familiar examples",
        videoUrl: "/videos/science/energy-en-1.mp4",
        duration: "6:30",
      },
      {
        id: "en-2",
        title: "Light and shadows",
        description: "Straight-line travel, opaque and transparent materials",
        videoUrl: "/videos/science/energy-en-2.mp4",
        duration: "6:00",
      },
      {
        id: "en-3",
        title: "Photosynthesis and energy conversions",
        description: "Light energy to chemical energy; fuels and cells",
        videoUrl: "/videos/science/energy-en-3.mp4",
        duration: "7:20",
      },
    ],
    questions: [
      {
        id: "en-q1",
        question:
          "In photosynthesis, the main energy change is:",
        options: [
          "Chemical energy becomes light only",
          "Light energy is converted into stored chemical energy in sugars",
          "Heat disappears completely",
          "Water is destroyed forever",
        ],
        correctAnswer: 1,
        explanation: "Plants trap light energy and store it in glucose and related compounds.",
      },
      {
        id: "en-q2",
        question:
          "A metal spoon handle gets hot when the bowl sits in hot soup mainly because heat travels along the metal by:",
        options: ["Convection in the handle", "Conduction through the solid", "Radiation only inside the soup", "Evaporation of the handle"],
        correctAnswer: 1,
        explanation: "Solids transfer heat along the material by conduction.",
      },
      {
        id: "en-q3",
        question:
          "A shadow forms when an opaque object blocks light because light travels:",
        options: ["In circles", "In straight lines in a uniform medium", "Only through metals", "Backwards from the Sun only"],
        correctAnswer: 1,
        explanation: "Rectilinear propagation creates sharp shadows behind opaque objects.",
      },
      {
        id: "en-q4",
        question:
          "Which is an example of a conversion from electrical energy to light and heat in a home?",
        options: ["A book on a shelf", "An LED lamp switched on", "A rock sitting in the sun", "Ice melting with no power source"],
        correctAnswer: 1,
        explanation: "The lamp uses electricity to produce light (and some heat).",
      },
      {
        id: "en-q5",
        question:
          "When a battery-powered fan spins, much of the electrical energy from the battery becomes:",
        options: [
          "Only stored chemical energy in the air",
          "Kinetic energy of the moving blades and some heat",
          "Nuclear energy in the wires",
          "Magnetic energy with no motion",
        ],
        correctAnswer: 1,
        explanation: "The motor transfers electrical energy to motion (kinetic) and warms slightly.",
      },
      {
        id: "en-q6",
        question:
          "Why does wearing a light-coloured shirt feel cooler than a dark one in strong sunlight?",
        options: [
          "Light colours absorb more sunlight",
          "Light colours reflect more visible light, absorbing less heating energy",
          "Dark shirts have no fabric",
          "Colour does not affect heat at all",
        ],
        correctAnswer: 1,
        explanation: "Pale surfaces reflect more radiation, so less solar energy is absorbed as heat.",
      },
    ],
  },
];

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    description: "Number, algebra, measurement, geometry, nets, and data",
    icon: "Calculator",
    color: "math",
    topics: mathTopics,
  },
  {
    id: "science",
    name: "Science",
    description: "Diversity, cycles, systems, interactions, and energy",
    icon: "Microscope",
    color: "science",
    topics: scienceTopics,
  },
];
