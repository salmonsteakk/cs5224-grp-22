import type { Question } from "../types/index.js";

export interface ExamPaperSeed {
  paperId: string;
  subjectId: "math" | "science";
  title: string;
  description: string;
  questions: Question[];
}

function Q(
  id: string,
  question: string,
  a: string,
  b: string,
  c: string,
  d: string,
  correctAnswer: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, question, options: [a, b, c, d], correctAnswer, explanation };
}

// --- science-mock-1: Diversity + inquiry emphasis; linked Q11–Q12, Q23–Q24 ---
const scienceMock1Questions: Question[] = [
  Q(
    "sci-p1-q1",
    "A group of pupils sorted leaves into two groups: Group A has net-like veins; Group B has parallel veins. Which theme of the 2026 syllabus does this sorting best illustrate?",
    "Cycles",
    "Diversity",
    "Systems",
    "Energy",
    1,
    "Concept: Classification uses observable features. Evidence: Vein pattern distinguishes monocots and dicots. Reasoning: Recognising differences among living things supports the Diversity theme."
  ),
  Q(
    "sci-p1-q2",
    "The table shows mass of four animals: P 0.9 kg, Q 800 g, R 50 g, S 0.5 kg. Which is the heaviest?",
    "P",
    "Q",
    "R",
    "S",
    0,
    "Concept: Compare mass using common units. Evidence: P = 900 g, Q = 800 g, R = 50 g, S = 500 g. Reasoning: P has the greatest mass."
  ),
  Q(
    "sci-p1-q3",
    "Which feature helps a fish stay buoyant in water?",
    "Thick fur",
    "Swim bladder",
    "Hollow bones",
    "Waxy cuticle",
    1,
    "Concept: Adaptations for aquatic life. Evidence: Swim bladder adjusts buoyancy. Reasoning: Fish use the swim bladder, not air sacs like birds’ hollow bones for flight."
  ),
  Q(
    "sci-p1-q4",
    "A pupil measures the length of a leaf four times: 8.1 cm, 8.0 cm, 8.2 cm, 8.1 cm. What should she report as the length to reduce random error?",
    "8.1 cm only",
    "The median of the four readings",
    "Only the first reading",
    "The smallest reading",
    1,
    "Concept: Reliability of measurement. Evidence: Repeated readings cluster around 8.1 cm. Reasoning: Using a central value (mean/median) reduces effect of random error."
  ),
  Q(
    "sci-p1-q5",
    "Which food test indicates the presence of starch?",
    "Iodine solution turns blue-black",
    "Benedict’s solution turns brick-red when heated",
    "Biuret reagent turns purple",
    "Ethanol emulsion test",
    0,
    "Concept: Starch testing. Evidence: Iodine–starch gives blue-black. Reasoning: Benedict’s tests reducing sugar; Biuret tests protein; ethanol tests fat."
  ),
  Q(
    "sci-p1-q6",
    "In a food chain: grass → grasshopper → frog → snake. Which organism is a primary consumer?",
    "Grass",
    "Grasshopper",
    "Frog",
    "Snake",
    1,
    "Concept: Trophic levels. Evidence: Primary consumers eat producers. Reasoning: Grasshopper eats grass; it is the primary consumer."
  ),
  Q(
    "sci-p1-q7",
    "Which process releases carbon dioxide into the air during the carbon cycle?",
    "Photosynthesis only",
    "Respiration and combustion",
    "Condensation",
    "Melting of ice",
    1,
    "Concept: Carbon cycle. Evidence: Respiration and burning release CO₂. Reasoning: Photosynthesis removes CO₂; condensation and melting are parts of water cycle, not carbon release as stated."
  ),
  Q(
    "sci-p1-q8",
    "A bar chart shows numbers of birds counted in four parks (Park W 12, X 8, Y 15, Z 5). Which park had the most birds?",
    "Park W",
    "Park X",
    "Park Y",
    "Park Z",
    2,
    "Concept: Data from charts. Evidence: Y has the tallest bar (15). Reasoning: Compare bar heights to find the maximum."
  ),
  Q(
    "sci-p1-q9",
    "Which material is the best electrical insulator among common classroom items?",
    "Copper wire",
    "Rubber glove",
    "Iron nail",
    "Aluminium foil",
    1,
    "Concept: Conductors vs insulators. Evidence: Rubber does not allow charges to flow easily. Reasoning: Metals conduct; rubber insulates."
  ),
  Q(
    "sci-p1-q10",
    "The human digestive system breaks down food mainly to allow",
    "absorption of smaller molecules into the blood",
    "photosynthesis in the stomach",
    "transpiration in the lungs",
    "circulation of oxygen in roots",
    0,
    "Concept: Digestion purpose. Evidence: Large molecules become smaller for absorption. Reasoning: Photosynthesis is plant process; transpiration is plant; lungs exchange gases, not digestion’s main outcome."
  ),
  Q(
    "sci-p1-q11",
    "Experiment (shared with Q12): A water plant is in a beaker. A lamp is placed at 10 cm and 30 cm from the plant. Bubbles counted per minute: at 10 cm → 40 bubbles; at 30 cm → 15 bubbles. Which pair correctly names the independent and dependent variables?",
    "Independent: bubbles per minute; Dependent: lamp distance",
    "Independent: lamp distance; Dependent: bubbles per minute",
    "Independent: water temperature; Dependent: lamp colour",
    "Independent: beaker size; Dependent: plant species",
    1,
    "Concept: Variables in fair tests. Evidence: Distance of lamp is changed; bubble rate is measured. Reasoning: The variable deliberately changed is independent; the measured outcome is dependent."
  ),
  Q(
    "sci-p1-q12",
    "Same setup as Q11: Why should the pupil keep the type of plant and water volume the same in both trials?",
    "To change the dependent variable",
    "To control variables so only lamp distance differs",
    "To increase random errors",
    "To remove the need for a control setup",
    1,
    "Concept: Fair testing. Evidence: Only one factor should differ between comparisons. Reasoning: Same plant and volume control confounding factors so results link to lamp distance."
  ),
  Q(
    "sci-p1-q13",
    "Which part of the plant is mainly responsible for absorbing water and mineral salts from soil?",
    "Leaf",
    "Stem",
    "Root hair region",
    "Flower",
    2,
    "Concept: Plant structure and function. Evidence: Root hairs increase surface area for uptake. Reasoning: Leaves mainly photosynthesise; stem supports; flower reproduces."
  ),
  Q(
    "sci-p1-q14",
    "During the water cycle, water vapour in the air cools and forms tiny water droplets in clouds. This process is called",
    "evaporation",
    "condensation",
    "melting",
    "sublimation",
    1,
    "Concept: Water cycle processes. Evidence: Gas to liquid in clouds is condensation. Reasoning: Evaporation is liquid to gas; melting is solid to liquid."
  ),
  Q(
    "sci-p1-q15",
    "A magnet is moved slowly toward an iron paper clip. The clip jumps to the magnet. This shows",
    "repulsion between like poles",
    "magnetic attraction of magnetic materials",
    "electrical insulation",
    "photosynthesis",
    1,
    "Concept: Magnetism. Evidence: Iron is attracted by magnets. Reasoning: Attraction, not repulsion; unrelated to electricity or biology here."
  ),
  Q(
    "sci-p1-q16",
    "Which renewable energy source depends most directly on daily solar radiation?",
    "Geothermal",
    "Hydroelectric (driven by rain and Sun-driven water cycle)",
    "Natural gas",
    "Coal",
    1,
    "Concept: Energy sources. Evidence: Sun powers evaporation and weather patterns feeding rivers. Reasoning: Geothermal is Earth’s internal heat; fossil fuels are stored ancient carbon, not direct daily solar for the plant’s operation in the same sense."
  ),
  Q(
    "sci-p1-q17",
    "In a closed bottle ecosystem, snails eat algae. What role do snails play?",
    "Producer",
    "Consumer",
    "Decomposer only",
    "Sun",
    1,
    "Concept: Feeding relationships. Evidence: Snails eat algae. Reasoning: Consumers feed on other organisms; algae are producers."
  ),
  Q(
    "sci-p1-q18",
    "A pupil tests soil pH with indicator: result pH 5. Which statement is most likely?",
    "The soil is strongly alkaline",
    "The soil is acidic",
    "The soil must be neutral",
    "pH cannot be measured",
    1,
    "Concept: pH scale. Evidence: pH below 7 is acidic. Reasoning: pH 5 is acidic, not alkaline or neutral."
  ),
  Q(
    "sci-p1-q19",
    "Which human activity most directly increases air pollution with smoke particles?",
    "Planting trees",
    "Burning fossil fuels in vehicles",
    "Using solar panels",
    "Cycling to school",
    1,
    "Concept: Human impact on environment. Evidence: Combustion releases particulates and gases. Reasoning: Trees and solar reduce impact; cycling reduces emissions."
  ),
  Q(
    "sci-p1-q20",
    "Sound travels fastest through",
    "vacuum",
    "air at room temperature",
    "water",
    "steel rod",
    3,
    "Concept: Sound and mediums. Evidence: Sound needs a medium; solids generally transmit fastest among solids/liquids/gases. Reasoning: Vacuum has no particles; steel is denser elastic solid than water/air for typical comparisons."
  ),
  Q(
    "sci-p1-q21",
    "Which sense organ detects chemicals dissolved in saliva and food?",
    "Skin",
    "Nose and tongue (taste)",
    "Ears",
    "Eyes only",
    1,
    "Concept: Human senses. Evidence: Taste buds detect chemicals in food. Reasoning: Smell also detects airborne chemicals; together with tongue for flavour perception in inquiry contexts."
  ),
  Q(
    "sci-p1-q22",
    "A food web shows arrows from algae → small fish → big fish → human. If small fish decrease due to pollution, what is a likely short-term effect on big fish?",
    "Big fish increase because of less competition",
    "Big fish decrease due to less food",
    "Algae decrease immediately to zero",
    "Humans gain more energy from algae directly",
    1,
    "Concept: Interactions in food webs. Evidence: Big fish eat small fish. Reasoning: Less prey leads to less food for predators, often population drop."
  ),
  Q(
    "sci-p1-q23",
    "Experiment (shared with Q24): Three identical cans hold 100 ml hot water at 80°C. Can A: no wrap; Can B: wrapped in cotton; Can C: wrapped in shiny aluminium foil (reflective side out). After 10 minutes, temperatures are A 55°C, B 62°C, C 48°C. Which can lost heat slowest?",
    "Can A",
    "Can B",
    "Can C",
    "All lost heat at the same rate",
    1,
    "Concept: Heat and insulation. Evidence: Highest final temperature means slowest heat loss to surroundings. Reasoning: B is warmest at 62°C, so cotton insulation slowed cooling most in this setup."
  ),
  Q(
    "sci-p1-q24",
    "Same cans as Q23: Which quantities should the pupil keep the same at the start to make the comparison fair?",
    "Only the final temperature",
    "Initial temperature and volume of hot water, and identical cans",
    "Only the colour of the table",
    "The cooling time only after water reaches 30°C",
    1,
    "Concept: Fair testing and control variables. Evidence: Same start temperature and volume ensure the same thermal energy to lose. Reasoning: Only the wrap differs; other factors are controlled."
  ),
  Q(
    "sci-p1-q25",
    "Which form of energy is stored in a stretched elastic band before release?",
    "Kinetic energy only",
    "Elastic potential energy",
    "Light energy",
    "Sound energy only",
    1,
    "Concept: Energy stores. Evidence: Stretched elastic stores elastic potential energy. Reasoning: Upon release, this converts to kinetic."
  ),
  Q(
    "sci-p1-q26",
    "A simple circuit has a battery, one closed switch, and one bulb. The bulb lights. If a second identical bulb is added in series, the current through the battery will generally",
    "increase a lot",
    "stay exactly the same",
    "decrease because total resistance increases",
    "become zero",
    2,
    "Concept: Series circuits. Evidence: More resistors in series increases total resistance. Reasoning: By Ohm’s law (qualitative), higher resistance tends to lower current for the same battery voltage."
  ),
  Q(
    "sci-p1-q27",
    "Which interaction describes a plant bending toward a window?",
    "Response to a stimulus (light)",
    "Photosynthesis only",
    "Evaporation only",
    "Magnetic induction",
    0,
    "Concept: Living organisms and stimuli. Evidence: Growth toward light is phototropism. Reasoning: It is a response, not purely chemical equation of photosynthesis alone."
  ),
  Q(
    "sci-p1-q28",
    "Earth’s rotation is linked to",
    "seasons due to tilt",
    "day and night cycle",
    "phases of the Moon only",
    "solar eclipses every day",
    1,
    "Concept: Earth in space. Evidence: Rotation causes day/night. Reasoning: Seasons relate more to tilt and orbit; Moon phases involve Moon orbit."
  ),
  Q(
    "sci-p1-q29",
    "In an experiment on evaporation, four identical wet cloths are placed: A in sun + wind, B in sun + still air, C in shade + wind, D in shade + still air. Which factor is being compared if we only look at A vs B?",
    "Light only",
    "Air movement (wind) only",
    "Temperature and light together only",
    "Humidity inside the cloth",
    1,
    "Concept: Controlled comparisons. Evidence: A and B both in sun; wind differs. Reasoning: Independent variable is air movement when comparing A and B."
  ),
  Q(
    "sci-p1-q30",
    "Why is biodiversity important for a stable ecosystem?",
    "It guarantees one species dominates all others",
    "It provides variety of roles so change in one species has buffers",
    "It removes all predators",
    "It stops the water cycle",
    1,
    "Concept: Interactions and stability. Evidence: Many species mean multiple food paths. Reasoning: Diversity can buffer ecosystems against change; dominance or removing predators is not the main rationale."
  ),
];

// --- science-mock-2: Cycles emphasis; linked Q11–Q12, Q23–Q24 ---
const scienceMock2Questions: Question[] = [
  Q(
    "sci-p2-q1",
    "The water cycle includes evaporation from oceans. What happens to water vapour as it rises and cools in the atmosphere?",
    "It always stays as vapour",
    "It condenses to form clouds",
    "It sublimates directly to ice only",
    "It is absorbed by roots only",
    1,
    "Concept: Water cycle. Evidence: Cooling water vapour forms droplets (condensation). Reasoning: Clouds are liquid/solid water particles suspended in air."
  ),
  Q(
    "sci-p2-q2",
    "In the carbon cycle, which process removes carbon dioxide from the air during daytime in a forest?",
    "Respiration by animals",
    "Photosynthesis in leaves",
    "Combustion of wood",
    "Evaporation from leaves",
    1,
    "Concept: Carbon cycle. Evidence: Plants use CO₂ for photosynthesis. Reasoning: Respiration and combustion release CO₂; evaporation is water, not carbon."
  ),
  Q(
    "sci-p2-q3",
    "A pupa is a stage in the life cycle of a butterfly. What type of change is this life cycle?",
    "Incomplete metamorphosis only",
    "Complete metamorphosis",
    "No metamorphosis",
    "Binary fission",
    1,
    "Concept: Life cycles. Evidence: Egg → larva → pupa → adult shows complete metamorphosis. Reasoning: Incomplete metamorphosis lacks a pupa stage."
  ),
  Q(
    "sci-p2-q4",
    "The rock cycle links igneous, sedimentary, and metamorphic rocks. Which process turns sediments into sedimentary rock?",
    "Melting",
    "Compaction and cementation",
    "Weathering only",
    "Photosynthesis",
    1,
    "Concept: Rock cycle. Evidence: Sediments are pressed and glued into rock. Reasoning: Melting forms magma; weathering breaks rocks down."
  ),
  Q(
    "sci-p2-q5",
    "In the nitrogen cycle, bacteria in root nodules help plants by",
    "fixing nitrogen into usable forms",
    "producing oxygen from nitrogen gas",
    "removing all water from soil",
    "stopping photosynthesis",
    0,
    "Concept: Nutrient cycles. Evidence: Nitrogen-fixing bacteria convert N₂ to ammonia/nitrates. Reasoning: Plants need fixed nitrogen for proteins."
  ),
  Q(
    "sci-p2-q6",
    "A graph shows river water level rising after heavy rain, then falling over several days. Which process mainly lowers the level after rain stops?",
    "Evaporation and flow downstream",
    "Condensation in clouds only",
    "Sublimation of river ice only",
    "Magnetic attraction",
    0,
    "Concept: Water movement. Evidence: Water leaves the river by flow and evaporation. Reasoning: After rain, runoff decreases and water drains away."
  ),
  Q(
    "sci-p2-q7",
    "Which moon phase occurs when the Moon is between Earth and the Sun (new moon region)?",
    "Full moon",
    "New moon",
    "First quarter",
    "Last quarter",
    1,
    "Concept: Moon phases cycle. Evidence: New moon when Moon is near Sun direction from Earth. Reasoning: Full moon is Earth between Sun and Moon."
  ),
  Q(
    "sci-p2-q8",
    "Day and night on Earth are caused mainly by",
    "Earth’s revolution around the Sun",
    "Earth’s rotation on its axis",
    "The Moon blocking the Sun every day",
    "Ocean tides only",
    1,
    "Concept: Earth cycles. Evidence: Rotation gives ~24 h cycle. Reasoning: Revolution causes seasons over a year, not daily day/night."
  ),
  Q(
    "sci-p2-q9",
    "In a plant life cycle, which structure is formed after pollination and fertilisation in flowering plants?",
    "Stamen only",
    "Seed (inside fruit)",
    "Root hair",
    "Stomata only",
    1,
    "Concept: Reproduction cycle in plants. Evidence: Fertilisation leads to embryo and seed. Reasoning: Stamen is male part; roots absorb water."
  ),
  Q(
    "sci-p2-q10",
    "Which change is chemical in a burning candle?",
    "Wax melting",
    "Wax reacting with oxygen to form new substances",
    "Wax bending",
    "Wax reflecting light",
    1,
    "Concept: Physical vs chemical change. Evidence: Burning produces CO₂ and water vapour. Reasoning: Melting is physical; burning is chemical reaction."
  ),
  Q(
    "sci-p2-q11",
    "Linked (Q12): A sealed plastic bottle has a little water at the bottom and air above. It is left in sunlight. After an hour, small droplets form on the inside wall at the top. What is the independent variable if the pupil tests three bottles at 20°C, 30°C, and 40°C room temperature?",
    "Size of droplets formed",
    "Room temperature",
    "Mass of the plastic bottle",
    "Colour of the bottle cap",
    1,
    "Concept: Variables. Evidence: Temperature is deliberately changed across set-ups. Reasoning: Independent variable is what the experimenter changes."
  ),
  Q(
    "sci-p2-q12",
    "Linked (Q11): The droplets at the top form because water vapour",
    "sublimates from glass to gas",
    "condenses when it meets a cooler surface",
    "evaporates from the cool surface only",
    "freezes because of magnetism",
    1,
    "Concept: Condensation. Evidence: Warm vapour hits cooler inner surface and forms liquid. Reasoning: Matches water cycle micro-model in the bottle."
  ),
  Q(
    "sci-p2-q13",
    "Which human practice helps maintain healthy nutrient cycles in farmland?",
    "Crop rotation and returning compost",
    "Burning all crop waste in open air daily",
    "Removing all bacteria from soil",
    "Using only sandy soil forever without change",
    0,
    "Concept: Sustainability. Evidence: Organic matter returns nutrients. Reasoning: Open burning pollutes; soil bacteria are essential."
  ),
  Q(
    "sci-p2-q14",
    "A simple food chain in a pond: algae → tadpole → fish. If pesticide washes in and kills many tadpoles, algae will likely",
    "decrease immediately",
    "increase because fewer tadpoles eat them",
    "stay exactly constant",
    "turn into fish",
    1,
    "Concept: Food chain interactions. Evidence: Fewer herbivores reduce grazing pressure on producers. Reasoning: Algae may bloom short term if consumers drop."
  ),
  Q(
    "sci-p2-q15",
    "Which process in the water cycle increases water vapour in the air from a puddle on a hot day?",
    "Condensation",
    "Evaporation",
    "Precipitation",
    "Percolation to bedrock only",
    1,
    "Concept: Water cycle. Evidence: Liquid to gas is evaporation. Reasoning: Condensation is gas to liquid; precipitation is falling water."
  ),
  Q(
    "sci-p2-q16",
    "Seasons in Singapore’s latitude differ from temperate regions mainly because Earth has",
    "no atmosphere",
    "a tilted axis relative to its orbit",
    "only one season",
    "a square orbit",
    1,
    "Concept: Earth–Sun geometry. Evidence: Tilt changes solar intensity through the year in temperate zones. Reasoning: Singapore is near equator with small seasonal variation but concept still assessed globally."
  ),
  Q(
    "sci-p2-q17",
    "In a fair test on plant growth, why record mass of soil at the start?",
    "To change the dependent variable",
    "To check the same soil mass was used in each pot",
    "To measure photosynthesis directly",
    "To calculate the speed of growth in m/s",
    1,
    "Concept: Controlled experiments. Evidence: Same soil mass controls a variable. Reasoning: Fair comparison needs controlled inputs."
  ),
  Q(
    "sci-p2-q18",
    "Which item is non-living but part of an ecosystem study?",
    "A mushroom feeding on dead wood",
    "Sunlight reaching a forest floor",
    "A fern",
    "A beetle",
    1,
    "Concept: Abiotic factors. Evidence: Sunlight is physical factor. Reasoning: Mushroom, fern, beetle are living or parts of biotic interactions."
  ),
  Q(
    "sci-p2-q19",
    "A bar chart shows monthly rainfall (mm): Jan 120, Feb 90, Mar 70, Apr 140. Which month had the least rainfall?",
    "January",
    "February",
    "March",
    "April",
    2,
    "Concept: Data interpretation. Evidence: March is smallest at 70 mm. Reasoning: Read minimum bar."
  ),
  Q(
    "sci-p2-q20",
    "Which process returns water from plants to the atmosphere in the water cycle?",
    "Transpiration",
    "Digestion",
    "Respiration in fish only",
    "Magnetic induction",
    0,
    "Concept: Plant role in water cycle. Evidence: Transpiration is water loss from leaves. Reasoning: Distinct from evaporation from free water surfaces."
  ),
  Q(
    "sci-p2-q21",
    "A metal can and a paper cup each hold 200 ml water at 90°C. After 5 minutes, metal can water reads 72°C and paper cup 78°C. Which conclusion is best supported?",
    "Metal conducted heat away faster than paper in this set-up",
    "Paper always has higher specific heat capacity than any metal",
    "Temperature readings are impossible",
    "Heat cannot flow through paper",
    0,
    "Concept: Heat transfer. Evidence: Larger temperature drop in metal can suggests faster heat loss through sides. Reasoning: Interpret table data qualitatively."
  ),
  Q(
    "sci-p2-q22",
    "Which cycle is most directly linked to decomposition by fungi and bacteria returning nutrients to soil?",
    "Only the water cycle",
    "Nutrient cycling including nitrogen and carbon",
    "Only the Moon phase cycle",
    "Rock cycle only",
    1,
    "Concept: Decomposers. Evidence: Decomposers break down organic matter, releasing nutrients. Reasoning: Links to nutrient cycles, not Moon phases."
  ),
  Q(
    "sci-p2-q23",
    "Linked (Q24): Two identical balloons A and B are inflated the same size. A is placed in a fridge at 5°C; B stays at room 28°C. After 20 minutes, A looks slightly deflated compared with B. What is the dependent variable?",
    "Temperature of the room",
    "Size/volume of the balloon (or appearance)",
    "Colour of the balloon",
    "Brand of the fridge",
    1,
    "Concept: Variables. Evidence: What is measured is dependent variable. Reasoning: Balloon volume/appearance is observed outcome."
  ),
  Q(
    "sci-p2-q24",
    "Linked (Q23): Gas particles inside the cooler balloon move more slowly. Which statement connects this to the observation?",
    "Slower particles collide less forcefully; pressure drops so volume decreases slightly",
    "Particles stop moving completely",
    "Particles become liquid immediately",
    "Only the rubber mass changes",
    0,
    "Concept: Particle model and temperature. Evidence: Lower temperature means lower average kinetic energy. Reasoning: For a sealed flexible balloon, pressure/volume relationship explains size change qualitatively."
  ),
  Q(
    "sci-p2-q25",
    "Which renewable resource is replenished by the water cycle for hydroelectric dams?",
    "Coal",
    "Flowing water in rivers",
    "Petroleum",
    "Natural gas trapped underground",
    1,
    "Concept: Energy and cycles. Evidence: Rainfall refills rivers. Reasoning: Fossil fuels are non-renewable on human timescales."
  ),
  Q(
    "sci-p2-q26",
    "A pupil measures the height of a plant every 2 days. The table shows: Day 0 → 4 cm, Day 2 → 6 cm, Day 4 → 7 cm, Day 6 → 7.5 cm. Which inference is reasonable?",
    "Growth rate is constant forever",
    "Growth is fastest early and slows later in this window",
    "The plant shrinks after Day 4",
    "The plant does not need light",
    1,
    "Concept: Data trends. Evidence: Increments 2 cm, then 1 cm, then 0.5 cm. Reasoning: Rate decreases over time in the data shown."
  ),
  Q(
    "sci-p2-q27",
    "Which interaction shows mutual benefit between organisms?",
    "A tick feeding on a dog",
    "Bee visiting a flower for nectar while pollen sticks to the bee",
    "Mould growing on old bread only harming bread",
    "A lion hunting a deer",
    1,
    "Concept: Symbiosis. Evidence: Pollination benefits plant; nectar benefits bee. Reasoning: Mutualism has benefits to both (in ideal simplified framing)."
  ),
  Q(
    "sci-p2-q28",
    "Why should electrical appliances be unplugged during a heavy thunderstorm in a basic safety lesson?",
    "To increase resistance of air",
    "To reduce risk from power surges/lightning-related faults",
    "To charge batteries faster",
    "To stop the water cycle",
    1,
    "Concept: Safety and systems. Evidence: Surges can damage devices. Reasoning: Practical precaution, not physics of air resistance."
  ),
  Q(
    "sci-p2-q29",
    "In a compost pile, heat is produced mainly because",
    "sunlight is trapped by glass",
    "microorganisms respire and decompose organic matter",
    "rocks melt",
    "water freezes",
    1,
    "Concept: Energy in ecosystems. Evidence: Decomposers release energy during respiration. Reasoning: Explains warming in active compost."
  ),
  Q(
    "sci-p2-q30",
    "Which statement about cycles is most accurate for conservation?",
    "Humans cannot affect any natural cycle",
    "Burning fossil fuels adds carbon dioxide, affecting the carbon cycle",
    "Water cannot be polluted",
    "Rocks never change form",
    1,
    "Concept: Human impact. Evidence: Fossil fuel combustion releases stored carbon. Reasoning: Links to global carbon cycle change."
  ),
];

// --- science-mock-3: Systems emphasis; linked Q11–Q12, Q23–Q24 ---
const scienceMock3Questions: Question[] = [
  Q(
    "sci-p3-q1",
    "Which organ system includes the heart, blood vessels, and blood?",
    "Digestive system",
    "Circulatory system",
    "Respiratory system",
    "Skeletal system only",
    1,
    "Concept: Body systems. Evidence: Heart pumps blood through vessels. Reasoning: Digestion handles food; respiration gas exchange."
  ),
  Q(
    "sci-p3-q2",
    "In the respiratory system, gas exchange between air and blood happens mainly in the",
    "trachea only",
    "alveoli of the lungs",
    "oesophagus",
    "large intestine",
    1,
    "Concept: Respiratory system. Evidence: Thin alveoli walls allow diffusion. Reasoning: Trachea conducts air; gut is for digestion."
  ),
  Q(
    "sci-p3-q3",
    "The human skeletal and muscular systems work together mainly to",
    "make food",
    "support the body and produce movement",
    "filter blood only",
    "produce hormones only",
    1,
    "Concept: Musculoskeletal system. Evidence: Bones levers; muscles contract. Reasoning: Movement and support are joint roles."
  ),
  Q(
    "sci-p3-q4",
    "Which electrical component is used to open or close a circuit?",
    "Battery",
    "Switch",
    "Bulb only",
    "Plastic ruler",
    1,
    "Concept: Electrical system. Evidence: Switch controls current path. Reasoning: Battery supplies energy; bulb converts energy."
  ),
  Q(
    "sci-p3-q5",
    "In a series circuit with one battery and two bulbs, where is the current the same (ideal wires)?",
    "Only at the battery",
    "The same everywhere in the single loop",
    "Only in the first bulb",
    "Zero everywhere",
    1,
    "Concept: Series circuits. Evidence: Single path means same current through components. Reasoning: Charge conservation in steady state."
  ),
  Q(
    "sci-p3-q6",
    "Which system in a plant transports water and mineral salts upward from roots?",
    "Phloem only",
    "Xylem",
    "Stomata only",
    "Petals",
    1,
    "Concept: Plant transport. Evidence: Xylem carries water and minerals. Reasoning: Phloem mainly transports sugars."
  ),
  Q(
    "sci-p3-q7",
    "A simple electrical diagram shows a fuse in series with appliances. The fuse is meant to",
    "increase current without limit",
    "melt and break the circuit when current is too high",
    "store charge like a battery",
    "produce light",
    1,
    "Concept: Electrical safety. Evidence: Fuse wire heats and melts at overcurrent. Reasoning: Protects wires from overheating."
  ),
  Q(
    "sci-p3-q8",
    "The digestive system works with the circulatory system because",
    "blood carries digested nutrients to cells",
    "stomach produces oxygen",
    "lungs digest fats",
    "bones absorb glucose directly from food",
    0,
    "Concept: System interactions. Evidence: Small intestine absorption into blood. Reasoning: Nutrients must reach all body cells."
  ),
  Q(
    "sci-p3-q9",
    "Which statement about a closed switch in a working torch is correct?",
    "No current flows",
    "Current flows in a complete path from battery through bulb",
    "The bulb must be in parallel with the battery only",
    "Voltage is always zero",
    1,
    "Concept: Current electricity. Evidence: Closed loop allows charge flow. Reasoning: Open switch stops the path."
  ),
  Q(
    "sci-p3-q10",
    "The human nervous system detects stimuli using sense organs and",
    "produces seeds",
    "sends messages to the brain for processing",
    "pumps plasma only",
    "filters urea in the leaf",
    1,
    "Concept: Nervous system. Evidence: Receptors to nerves to brain. Reasoning: Coordinates responses; not plant reproduction."
  ),
  Q(
    "sci-p3-q11",
    "Linked (Q12): Two bulbs X and Y are identical and wired in parallel across a battery. If the wire to bulb Y breaks, what happens to bulb X?",
    "X goes off because parallel circuits stop completely",
    "X can still light if its branch is still complete",
    "X becomes twice as bright always",
    "X short-circuits the battery automatically",
    1,
    "Concept: Parallel circuits. Evidence: Branches are independent. Reasoning: One branch break does not necessarily open the other branch."
  ),
  Q(
    "sci-p3-q12",
    "Linked (Q11): Compared with wiring the same two bulbs in series with the same battery, parallel wiring typically makes each bulb",
    "dimmer because current splits",
    "brighter because each has the full battery voltage across it (ideal model)",
    "off because voltage adds to zero",
    "unrelated to brightness",
    1,
    "Concept: Series vs parallel. Evidence: In parallel, each branch voltage equals battery voltage (ideal). Reasoning: Series shares voltage, often dimmer bulbs."
  ),
  Q(
    "sci-p3-q13",
    "Which excretory organ helps maintain water balance by filtering blood and forming urine?",
    "Lungs",
    "Kidneys",
    "Skin only for all wastes",
    "Small intestine",
    1,
    "Concept: Excretory system. Evidence: Kidneys filter and adjust water/salts. Reasoning: Lungs remove CO₂; skin sweats but kidneys central for urine."
  ),
  Q(
    "sci-p3-q14",
    "A lever system in the arm (bone as bar, joint as fulcrum) is an example of",
    "the digestive system only",
    "how skeletal and muscular systems interact",
    "photosynthesis",
    "water cycle",
    1,
    "Concept: Body systems. Evidence: Muscles provide force on bones. Reasoning: Simple machines in body context."
  ),
  Q(
    "sci-p3-q15",
    "Which material is a conductor used in household wiring cores?",
    "Rubber insulation",
    "Copper",
    "Plastic socket casing",
    "Dry wood",
    1,
    "Concept: Electrical materials. Evidence: Copper conducts well. Reasoning: Insulators coat conductors for safety."
  ),
  Q(
    "sci-p3-q16",
    "Stomata in leaves are part of the plant’s interaction with air because they",
    "absorb mineral salts from soil",
    "allow gas exchange and water vapour loss",
    "produce seeds",
    "conduct electricity",
    1,
    "Concept: Plant gas exchange. Evidence: Stomata open for CO₂ and release water vapour. Reasoning: Not primary for mineral uptake."
  ),
  Q(
    "sci-p3-q17",
    "A voltmeter is connected correctly across a bulb to measure",
    "current through the bulb",
    "potential difference (voltage) across the bulb",
    "resistance of the air",
    "mass of the bulb",
    1,
    "Concept: Electrical measurement. Evidence: Voltmeter in parallel across component. Reasoning: Ammeter is series for current."
  ),
  Q(
    "sci-p3-q18",
    "Which gland system uses hormones transported by blood to coordinate long-term processes like growth?",
    "Nervous system only",
    "Endocrine system",
    "Digestive system only",
    "Skeletal system only",
    1,
    "Concept: Hormonal control. Evidence: Hormones in blood target organs. Reasoning: Nervous system is faster electrical/chemical synapses at nerves."
  ),
  Q(
    "sci-p3-q19",
    "In a food chain, energy transfer between trophic levels is typically inefficient because",
    "energy is lost as heat during respiration and waste",
    "all energy becomes new biomass",
    "producers eat consumers",
    "decomposers create energy from nothing",
    0,
    "Concept: Energy in ecosystems. Evidence: Respiration loses heat; not all eaten matter assimilated. Reasoning: Explains pyramid shape."
  ),
  Q(
    "sci-p3-q20",
    "Which part of the human brain is most associated with coordinating voluntary muscle movement in many basic lessons?",
    "Cerebellum (coordination/balance)",
    "Stomach lining",
    "Trachea",
    "Root cap",
    0,
    "Concept: Nervous system. Evidence: Cerebellum coordinates movement. Reasoning: Not digestive or plant structures."
  ),
  Q(
    "sci-p3-q21",
    "A battery labelled 3 V is connected to a resistor. If a second identical resistor is added in series, total resistance",
    "halves",
    "doubles",
    "stays exactly zero",
    "becomes infinite without wires",
    1,
    "Concept: Series resistance. Evidence: R_total = R1 + R2 for series. Reasoning: Identical resistors double total in series."
  ),
  Q(
    "sci-p3-q22",
    "The human immune system interacts with pathogens mainly by",
    "photosynthesis",
    "recognising and responding to harmful microorganisms",
    "forming xylem vessels",
    "producing seeds",
    1,
    "Concept: Immune defence. Evidence: White blood cells and antibodies. Reasoning: System-level protection."
  ),
  Q(
    "sci-p3-q23",
    "Linked (Q24): A model ‘human’ has a balloon ‘stomach’ squeezed by hands, pushing air into a tube ‘oesophagus’ to a second balloon ‘lung’. What does squeezing the stomach balloon model?",
    "Gas exchange in alveoli",
    "Diaphragm/intercostal action increasing lung volume for inhalation in a very simplified way",
    "Filtration in kidney",
    "Digestion of starch in mouth only",
    1,
    "Concept: Modelling body systems. Evidence: Movement changes lung volume in real breathing. Reasoning: Models simplify relationships for inquiry."
  ),
  Q(
    "sci-p3-q24",
    "Linked (Q23): Why is any model of breathing only an approximation?",
    "Models are always exact copies of reality",
    "Real breathing involves many organs, tissues, and feedback not shown in a balloon toy",
    "Lungs do not change volume",
    "Air has no mass",
    1,
    "Concept: Scientific models. Evidence: Simplified parts omit details. Reasoning: Useful but limited for predictions."
  ),
  Q(
    "sci-p3-q25",
    "Earthworm’s circulatory system is simpler than humans but still transports",
    "chlorophyll",
    "dissolved substances and gases in blood-like fluid",
    "only solid food",
    "sunlight",
    1,
    "Concept: Transport in animals. Evidence: Closed/simple vessels move nutrients and gases. Reasoning: Not plant pigments."
  ),
  Q(
    "sci-p3-q26",
    "Which change increases total current from a fixed battery in a simple resistive circuit (ideal)?",
    "Adding resistors in series",
    "Reducing total resistance of the circuit",
    "Opening the switch",
    "Using a longer wire only to increase resistance without changing connection",
    1,
    "Concept: Current and resistance (qualitative). Evidence: I increases if R decreases for fixed V. Reasoning: Ohm’s law idea without formula emphasis."
  ),
  Q(
    "sci-p3-q27",
    "The female reproductive system includes structures that produce eggs and support development. Which organ houses the developing embryo during pregnancy?",
    "Ovary",
    "Uterus",
    "Testis",
    "Stomach",
    1,
    "Concept: Human reproduction system. Evidence: Uterus is womb. Reasoning: Ovaries release eggs; testis is male."
  ),
  Q(
    "sci-p3-q28",
    "A thermostat system in an air-conditioner is similar to body temperature regulation because both use",
    "feedback to maintain a set point",
    "only random changes",
    "photosynthesis",
    "ignoring sensors",
    0,
    "Concept: Control systems. Evidence: Sensor compares to target; response corrects drift. Reasoning: Homeostasis analogy."
  ),
  Q(
    "sci-p3-q29",
    "Which practice protects both electrical and human body systems when using appliances?",
    "Touch plugs with wet hands",
    "Dry hands and proper grounding/insulation as taught",
    "Overload one socket with many adaptors unsafely",
    "Use damaged cables for fun",
    1,
    "Concept: Safety. Evidence: Water conducts; damaged wires risk shock. Reasoning: Reduces harm to the body’s nervous/muscular systems."
  ),
  Q(
    "sci-p3-q30",
    "Why do multiple organ systems need to work together during exercise?",
    "Only the skin works",
    "Circulatory, respiratory, muscular, and nervous systems coordinate to deliver oxygen and remove wastes faster",
    "Digestion stops forever",
    "Plants run for the human",
    1,
    "Concept: System integration. Evidence: Heart rate and breathing increase; muscles need ATP. Reasoning: Interacting systems."
  ),
];

// --- science-mock-4: Interactions emphasis; linked Q11–Q12, Q23–Q24 ---
const scienceMock4Questions: Question[] = [
  Q(
    "sci-p4-q1",
    "A lion hunting a zebra shows an interaction where the lion is",
    "a producer",
    "a predator (consumer)",
    "a decomposer",
    "sunlight",
    1,
    "Concept: Feeding interactions. Evidence: Lion eats another animal. Reasoning: Predator–prey relationship."
  ),
  Q(
    "sci-p4-q2",
    "Two plant species compete for the same limited sunlight in a forest. This is an interaction called",
    "mutualism",
    "competition",
    "commensalism always",
    "neutralism with infinite resources",
    1,
    "Concept: Species interactions. Evidence: Shared limiting resource. Reasoning: Competition when both need the same resource."
  ),
  Q(
    "sci-p4-q3",
    "Bees and flowering plants interact: bees get nectar; plants get pollination. This is often described as",
    "parasitism",
    "mutual benefit (mutualism)",
    "predation",
    "competition",
    1,
    "Concept: Interactions. Evidence: Both gain. Reasoning: Distinct from one-sided harm (parasitism)."
  ),
  Q(
    "sci-p4-q4",
    "In a grassland, a fire removes dead grass. Some seeds germinate only after fire. This shows interaction between",
    "plants and abiotic factor (fire heat/cues)",
    "only animals",
    "Moon phases only",
    "magnetic poles only",
    0,
    "Concept: Biotic–abiotic interactions. Evidence: Fire is environmental factor affecting germination. Reasoning: Ecosystem response to disturbance."
  ),
  Q(
    "sci-p4-q5",
    "A table shows number of ladybirds vs aphids in a garden over weeks: as ladybirds increase, aphids decrease. What interaction is suggested?",
    "Ladybirds eat aphids (predator–prey)",
    "Aphids eat ladybirds",
    "No relationship",
    "Both are producers",
    0,
    "Concept: Population interactions. Evidence: Inverse trend supports predation. Reasoning: Interpret paired data."
  ),
  Q(
    "sci-p4-q6",
    "When an iron nail is placed near a magnet, the nail can become induced as a",
    "battery",
    "temporary magnet",
    "insulator forever",
    "laser",
    1,
    "Concept: Magnetic interactions. Evidence: Magnetic domains align in ferromagnetic materials. Reasoning: Induced magnetism near pole."
  ),
  Q(
    "sci-p4-q7",
    "Which force interaction slows a book sliding on a rough table?",
    "Magnetic repulsion only",
    "Friction between surfaces",
    "Buoyant force upward exceeding weight",
    "Solar wind",
    1,
    "Concept: Forces. Evidence: Friction opposes relative motion. Reasoning: Normal contact force context."
  ),
  Q(
    "sci-p4-q8",
    "A plant’s roots interact with soil bacteria that fix nitrogen. This helps the plant by",
    "blocking all water",
    "providing usable nitrogen compounds",
    "making the plant carnivorous",
    "stopping photosynthesis",
    1,
    "Concept: Symbiosis in ecosystems. Evidence: Rhizobia in legumes fix N₂. Reasoning: Mutual benefit in many cases."
  ),
  Q(
    "sci-p4-q9",
    "In a pond, duckweed covers the surface and blocks light to underwater plants below. This interaction is mainly",
    "competition for light",
    "mutualism",
    "predation",
    "neutral",
    0,
    "Concept: Plant interactions. Evidence: Shading reduces light for sublayers. Reasoning: Competition for shared resource."
  ),
  Q(
    "sci-p4-q10",
    "Human fishing reduces shark populations. Fewer sharks may let mid-level fish increase, which then eat more small herbivorous fish—possibly affecting algae. This illustrates",
    "trophic cascades through interactions",
    "no food webs",
    "only one trophic level matters",
    "photosynthesis in sharks",
    0,
    "Concept: Food web interactions. Evidence: Top predator change ripples through levels. Reasoning: Ecosystem connectedness."
  ),
  Q(
    "sci-p4-q11",
    "Linked (Q12): Two identical metal balls A and B hang on strings. A is charged negative; B is neutral. When A is brought near B without touching, B is attracted. What interaction is mainly demonstrated?",
    "Induction causing redistribution of charge in the conductor",
    "Both must have same charge always",
    "Gravity is impossible between metals",
    "Magnets only",
    0,
    "Concept: Electrostatic interaction. Evidence: Charged object induces separation in neutral conductor, attraction. Reasoning: Not permanent charging without transfer."
  ),
  Q(
    "sci-p4-q12",
    "Linked (Q11): If A touches B briefly and then is separated, both may repel later. Why?",
    "They share charge by conduction; similar charge signs repel",
    "They lose all electrons",
    "They become uncharged wood",
    "Heat alone causes repulsion",
    0,
    "Concept: Charging by contact. Evidence: Electrons transfer; like charges repel. Reasoning: After sharing, excess same sign on both."
  ),
  Q(
    "sci-p4-q13",
    "Which human activity increases interaction between land and water systems via erosion?",
    "Planting trees on slopes",
    "Clearing vegetation on steep slopes without protection",
    "Using terraces to slow runoff",
    "Mulching soil",
    1,
    "Concept: Human–environment interactions. Evidence: Bare soil erodes more. Reasoning: Vegetation reduces runoff energy."
  ),
  Q(
    "sci-p4-q14",
    "A vacuum flask reduces heat transfer by limiting conduction and convection with a near-vacuum gap and reflective surfaces. This is an application of",
    "photosynthesis",
    "energy transfer control",
    "digestion",
    "binary fission",
    1,
    "Concept: Heat and insulation. Evidence: Vacuum reduces particle transfer; reflection reduces radiation. Reasoning: Practical thermal interaction."
  ),
  Q(
    "sci-p4-q15",
    "Ants protect aphids from predators; aphids secrete honeydew for ants. This interaction is",
    "mutualism",
    "competition only",
    "predation",
    "neutral",
    0,
    "Concept: Symbiosis. Evidence: Benefits to both species. Reasoning: Classic mutualism example."
  ),
  Q(
    "sci-p4-q16",
    "When salt dissolves in water, the interaction between salt ions and water molecules is part of",
    "only magnetic levitation",
    "dissolving (physical/chemical interaction at particle level)",
    "photosynthesis",
    "sound refraction only",
    1,
    "Concept: Matter interactions. Evidence: Dissolution involves attraction between water and ions. Reasoning: Inquiry into solutions."
  ),
  Q(
    "sci-p4-q17",
    "A student pushes a box on a smooth floor with constant force and the box speeds up. Net force is",
    "zero",
    "non-zero in the direction of motion",
    "always opposite to motion",
    "impossible to determine",
    1,
    "Concept: Force and motion. Evidence: Acceleration implies net force (Newton’s laws qualitatively). Reasoning: Smooth floor still can have unbalanced force."
  ),
  Q(
    "sci-p4-q18",
    "In a food web, removing a keystone species can cause",
    "no change",
    "large changes in many populations due to interconnected interactions",
    "only producers to vanish instantly",
    "only the Sun to stop",
    1,
    "Concept: Ecosystem interactions. Evidence: Many species depend on others. Reasoning: Web structure matters."
  ),
  Q(
    "sci-p4-q19",
    "Which pair shows interaction between living and non-living factor?",
    "Fish → fish",
    "Plant → sunlight for photosynthesis",
    "Decomposer → decomposer",
    "Wolf → deer",
    1,
    "Concept: Abiotic–biotic. Evidence: Light is abiotic; plant is biotic. Reasoning: Predator–prey is biotic–biotic."
  ),
  Q(
    "sci-p4-q20",
    "A metal spoon in hot soup becomes hot at the handle end mainly by",
    "conduction along the spoon",
    "radiation only through vacuum in the spoon",
    "convection inside solid metal only",
    "photosynthesis",
    0,
    "Concept: Heat transfer. Evidence: Solids conduct energy along lattice. Reasoning: Handle heats after time."
  ),
  Q(
    "sci-p4-q21",
    "Pollution runoff from farms can interact with a river by",
    "increasing nutrients and sometimes causing algal blooms",
    "removing all oxygen permanently in one second",
    "stopping evaporation",
    "creating vacuum in water",
    0,
    "Concept: Human impact on water systems. Evidence: Nitrates/phosphates feed algae. Reasoning: Eutrophication process."
  ),
  Q(
    "sci-p4-q22",
    "Two north poles of magnets placed facing each other will",
    "attract",
    "repel",
    "have no force",
    "merge into one pole",
    1,
    "Concept: Magnetic interaction. Evidence: Like poles repel. Reasoning: Basic pole rule."
  ),
  Q(
    "sci-p4-q23",
    "Linked (Q24): A ball is dropped onto a spring scale from a low height. First trial: height 20 cm → scale peak reading 4 units. Second trial: height 40 cm → peak reading 7 units. What is the independent variable changed?",
    "Peak reading on the scale",
    "Drop height",
    "Colour of the ball",
    "Room humidity only",
    1,
    "Concept: Fair test variables. Evidence: Height is intentionally varied. Reasoning: Peak reading is measured (dependent)."
  ),
  Q(
    "sci-p4-q24",
    "Linked (Q23): Why repeat the drop three times at each height?",
    "To guarantee the same peak reading every time",
    "To reduce effect of random errors and find a more reliable pattern",
    "To change the control variable",
    "To make the ball heavier",
    1,
    "Concept: Inquiry reliability. Evidence: Repeats show spread; averages help. Reasoning: Science practice, not certainty."
  ),
  Q(
    "sci-p4-q25",
    "Coral and algae in coral tissues interact: algae photosynthesise and share products; coral provides shelter. Stress can break this interaction causing bleaching. The algae are mainly",
    "predators of coral",
    "photosynthetic partners (zooxanthellae) in mutualistic interaction",
    "decomposers only",
    "viruses only",
    1,
    "Concept: Marine interactions. Evidence: Mutual benefit under normal conditions. Reasoning: Bleaching when partnership fails."
  ),
  Q(
    "sci-p4-q26",
    "When sound hits a wall and bounces, the interaction is",
    "refraction only",
    "reflection",
    "photosynthesis",
    "digestion",
    1,
    "Concept: Wave interactions. Evidence: Echo is reflected sound. Reasoning: Boundary interaction."
  ),
  Q(
    "sci-p4-q27",
    "In a closed bottle ecosystem, gas exchange between water and air at the surface is an interaction important for",
    "dissolved oxygen for organisms",
    "stopping all life",
    "removing water forever",
    "creating vacuum",
    0,
    "Concept: Gas–liquid interface. Evidence: Oxygen dissolves from air. Reasoning: Aquatic respiration link."
  ),
  Q(
    "sci-p4-q28",
    "A student tests how surface texture affects sliding distance of a toy car down a ramp (same ramp angle, same car). The dependent variable is",
    "texture material chosen",
    "distance the car travels on the flat track after the ramp",
    "mass of Earth",
    "colour of the ramp",
    1,
    "Concept: Inquiry design. Evidence: Measured outcome is distance. Reasoning: Texture is independent in this design."
  ),
  Q(
    "sci-p4-q29",
    "Why is camouflage an interaction between prey and environment?",
    "It makes prey invisible to physics",
    "It reduces detection by predators using visual cues",
    "It speeds up photosynthesis",
    "It removes need for DNA",
    1,
    "Concept: Adaptation and predation. Evidence: Appearance matches background. Reasoning: Survival interaction."
  ),
  Q(
    "sci-p4-q30",
    "Stable interactions in a community help maintain balance; a sudden invasive species may",
    "never affect others",
    "disrupt existing interactions and populations",
    "only help all native species",
    "stop the water cycle",
    1,
    "Concept: Invasive species. Evidence: New competitors/predators alter webs. Reasoning: Ecosystem change."
  ),
];

// --- science-mock-5: Energy emphasis; linked Q11–Q12, Q23–Q24 ---
const scienceMock5Questions: Question[] = [
  Q(
    "sci-p5-q1",
    "Which energy change occurs in a hydroelectric turbine driven by falling water?",
    "Chemical → electrical directly without motion",
    "Gravitational potential/kinetic of water → electrical via generator",
    "Nuclear → sound only",
    "Light → mass",
    1,
    "Concept: Energy conversions. Evidence: Moving water spins turbine linked to generator. Reasoning: Chain of transfers."
  ),
  Q(
    "sci-p5-q2",
    "A stretched rubber band stores mainly",
    "nuclear energy",
    "elastic potential energy",
    "chemical energy in petrol",
    "geothermal energy",
    1,
    "Concept: Energy stores. Evidence: Deformation stores elastic PE. Reasoning: Release becomes kinetic."
  ),
  Q(
    "sci-p5-q3",
    "Photosynthesis captures light energy and stores chemical energy mainly in",
    "oxygen gas released",
    "glucose (and related compounds)",
    "nitrogen gas",
    "pure heat only with no product",
    1,
    "Concept: Energy in life. Evidence: Sugars store chemical energy. Reasoning: Oxygen is by-product."
  ),
  Q(
    "sci-p5-q4",
    "In a food chain, energy from the Sun enters the chain when",
    "herbivores eat carnivores",
    "producers convert light to chemical energy",
    "decomposers photosynthesise",
    "rocks melt",
    1,
    "Concept: Energy flow. Evidence: Producers fix energy. Reasoning: Starts trophic input."
  ),
  Q(
    "sci-p5-q5",
    "Burning fuel in a car engine converts stored chemical energy mainly into",
    "only electrical energy in the battery with no heat",
    "kinetic energy and heat (and sound)",
    "mass increase of the car",
    "gravitational energy of the Moon",
    1,
    "Concept: Energy degradation. Evidence: Combustion releases thermal and mechanical work. Reasoning: Not 100% useful work."
  ),
  Q(
    "sci-p5-q6",
    "A solar panel converts",
    "light to electrical energy",
    "heat from Earth core to light",
    "sound to mass",
    "water to petrol",
    0,
    "Concept: Renewable energy. Evidence: Photovoltaic effect. Reasoning: Sunlight to electricity."
  ),
  Q(
    "sci-p5-q7",
    "When a ball rolls uphill and slows, kinetic energy is mainly converted to",
    "gravitational potential energy (and some heat via friction)",
    "only sound in vacuum",
    "chemical energy in the ball’s rubber instantly",
    "magnetic energy in the air always",
    0,
    "Concept: Energy transfer. Evidence: Height gain stores GPE. Reasoning: Friction adds heat loss."
  ),
  Q(
    "sci-p5-q8",
    "Why does a room get warm when a computer runs for a long time?",
    "Computers absorb cold from users",
    "Electrical energy becomes thermal energy in components",
    "The room loses all oxygen",
    "Screens perform photosynthesis",
    1,
    "Concept: Energy dissipation. Evidence: Resistance and processors generate heat. Reasoning: Energy conservation into thermal."
  ),
  Q(
    "sci-p5-q9",
    "In a torch, the battery’s chemical energy becomes mainly",
    "electrical energy then light and heat at the bulb",
    "only sound in the battery",
    "mass of the case only",
    "nuclear fusion in the bulb",
    0,
    "Concept: Device energy path. Evidence: Current through filament/LED produces light. Reasoning: Some energy always heat."
  ),
  Q(
    "sci-p5-q10",
    "Wind turbines transform",
    "kinetic energy of air movement to electrical energy",
    "electrical to chemical only",
    "thermal energy of ground to nuclear",
    "tidal energy only always",
    0,
    "Concept: Energy sources. Evidence: Blades turn generator. Reasoning: Mechanical to electrical."
  ),
  Q(
    "sci-p5-q11",
    "Linked (Q12): A pendulum swings: at the highest point it has most gravitational potential energy and least kinetic; at the lowest point the opposite. As the bob moves down from highest to lowest, gravitational potential energy mainly",
    "increases",
    "decreases as kinetic increases",
    "stays zero always",
    "becomes chemical",
    1,
    "Concept: Energy conservation (mechanical). Evidence: Height loss reduces GPE; speed increases KE. Reasoning: Transfer between stores."
  ),
  Q(
    "sci-p5-q12",
    "Linked (Q11): Why does the pendulum eventually stop without extra push?",
    "Energy is destroyed",
    "Friction and air resistance dissipate mechanical energy as heat",
    "Gravity turns off",
    "Potential energy doubles each swing",
    1,
    "Concept: Energy dissipation. Evidence: Non-conservative forces reduce amplitude. Reasoning: Total mechanical energy decreases to thermal."
  ),
  Q(
    "sci-p5-q13",
    "Food labels report energy in kilojoules because",
    "energy in food is stored chemically and released by respiration",
    "food has no energy",
    "labels measure only water mass",
    "kilojoules are a unit of length",
    0,
    "Concept: Energy in nutrition. Evidence: Metabolism releases stored chemical energy. Reasoning: Relates to diet and respiration."
  ),
  Q(
    "sci-p5-q14",
    "A hot cup of coffee cools to room temperature. Energy flows mainly",
    "from coffee to surroundings until thermal equilibrium",
    "from room to coffee forever without stopping",
    "only upward against gravity",
    "from coffee to the Moon only",
    0,
    "Concept: Heat transfer direction. Evidence: Hotter object loses thermal energy to cooler surroundings. Reasoning: Second law idea qualitatively."
  ),
  Q(
    "sci-p5-q15",
    "Which process releases energy from glucose in cells for activities?",
    "Photosynthesis",
    "Aerobic respiration",
    "Condensation only",
    "Melting only",
    1,
    "Concept: Cellular energy. Evidence: Respiration breaks down glucose, releases ATP. Reasoning: Opposite pathway to photosynthesis."
  ),
  Q(
    "sci-p5-q16",
    "A roller coaster car at the top of a hill has large",
    "gravitational potential energy relative to the bottom",
    "only elastic energy in the harness",
    "no energy because it is not moving much yet",
    "chemical energy in the wheels only",
    0,
    "Concept: Mechanical energy stores. Evidence: Height gives GPE. Reasoning: Will convert to KE on descent."
  ),
  Q(
    "sci-p5-q17",
    "Why is perpetual motion machine impossible in the real world?",
    "Energy can be created from nothing",
    "Some energy always becomes less useful heat due to friction/resistance",
    "Gravity does not exist",
    "Mass has no energy",
    1,
    "Concept: Energy conservation and dissipation. Evidence: Losses reduce usable energy each cycle. Reasoning: Cannot run forever without input."
  ),
  Q(
    "sci-p5-q18",
    "Biomass energy from burning wood mainly comes from",
    "Sun energy stored long ago in plant material via photosynthesis",
    "Earth’s core only",
    "Moonlight only",
    "vacuum energy",
    0,
    "Concept: Stored solar energy. Evidence: Wood is plant matter. Reasoning: Chemical energy from photosynthesis."
  ),
  Q(
    "sci-p5-q19",
    "An LED lamp is more efficient than many filament bulbs because",
    "it produces more useful light per unit electrical energy",
    "it violates energy conservation",
    "it creates energy from cold",
    "it uses only sound",
    0,
    "Concept: Efficiency. Evidence: Less waste heat for same brightness. Reasoning: Compare energy outputs."
  ),
  Q(
    "sci-p5-q20",
    "When you clap hands, mechanical energy becomes",
    "mainly sound and heat",
    "only stored nuclear energy",
    "photosynthesis products",
    "zero energy transfer",
    0,
    "Concept: Energy transformation. Evidence: Sound waves carry energy; friction heats skin. Reasoning: Multiple pathways."
  ),
  Q(
    "sci-p5-q21",
    "A battery in a circuit supplies energy to move charges. The energy per charge concept used in lessons is related to",
    "voltage",
    "only colour of wire",
    "mass of the battery case only",
    "number of leaves on a tree",
    0,
    "Concept: Electrical energy (qualitative). Evidence: Battery provides potential difference. Reasoning: Drives current in circuit."
  ),
  Q(
    "sci-p5-q22",
    "Geothermal power uses energy from",
    "hot rock/steam underground",
    "only wind above ground",
    "Moon gravity only",
    "burning plastic in air always",
    0,
    "Concept: Energy resources. Evidence: Earth’s internal thermal energy. Reasoning: Renewable in human timescales in some regions."
  ),
  Q(
    "sci-p5-q23",
    "Linked (Q24): An experiment compares temperature rise in 100 g water using heaters labelled 50 W and 100 W for 5 minutes each, same start temperature. What is the independent variable?",
    "Final temperature of water",
    "Power of the heater",
    "Mass of water (should be controlled, not varied here)",
    "Colour of the beaker if same for both",
    1,
    "Concept: Variables. Evidence: Power is changed between set-ups. Reasoning: Temperature rise is measured (dependent)."
  ),
  Q(
    "sci-p5-q24",
    "Linked (Q23): Why use the same mass of water and same container?",
    "To make dependent and independent the same",
    "To control variables so energy gain links to heater power, not different water amounts",
    "To remove the need for a thermometer",
    "To change room pressure only",
    1,
    "Concept: Fair testing. Evidence: Same thermal capacity setup isolates heater effect. Reasoning: Controls confounding factors."
  ),
  Q(
    "sci-p5-q25",
    "In photosynthesis, light energy is absorbed by",
    "mitochondria in animals",
    "chlorophyll in chloroplasts",
    "roots only",
    "copper wires",
    1,
    "Concept: Light capture. Evidence: Chlorophyll pigments in plants. Reasoning: Site of light-dependent steps."
  ),
  Q(
    "sci-p5-q26",
    "A dam stores water high up. Before release, the water has relatively more",
    "gravitational potential energy",
    "kinetic energy at the top if static",
    "only chemical energy",
    "sound energy in the concrete",
    0,
    "Concept: Energy storage. Evidence: Height in gravity field. Reasoning: Converts to KE when falling."
  ),
  Q(
    "sci-p5-q27",
    "Why do we feel warm in sunlight?",
    "The Sun does not emit energy",
    "Radiant energy from the Sun is absorbed by skin and surroundings",
    "Only the Moon heats us",
    "Air has no thermal energy",
    1,
    "Concept: Radiation energy transfer. Evidence: Electromagnetic radiation carries energy. Reasoning: Not conduction through empty space."
  ),
  Q(
    "sci-p5-q28",
    "Burning fossil fuels transfers ancient stored energy to",
    "heat and kinetic energy in engines, and light in flames",
    "only mass increase of oxygen",
    "photosynthesis in engines",
    "zero environmental effect",
    0,
    "Concept: Fossil fuel use. Evidence: Combustion releases chemical bond energy. Reasoning: Linked to engines and warming."
  ),
  Q(
    "sci-p5-q29",
    "In an ecosystem, energy pyramids are usually wide at the base because",
    "energy is lost between trophic levels as heat and wastes",
    "energy increases at each level",
    "producers eat consumers",
    "decomposers create energy",
    0,
    "Concept: Energy flow rules. Evidence: ~10% transfer rule (qualitative). Reasoning: Less biomass/energy at top levels."
  ),
  Q(
    "sci-p5-q30",
    "Saving energy at home reduces environmental impact mainly because",
    "less fossil fuel burning and fewer emissions for the same services",
    "energy is destroyed when we switch off lights",
    "renewables have no limits ever",
    "insulation removes all heat transfer",
    0,
    "Concept: Energy and environment. Evidence: Lower demand reduces combustion. Reasoning: Conservation benefits climate/air quality."
  ),
];

// --- math-mock-1: Paper 1 Booklet A style; Q1–Q10 shorter, Q11–Q15 multi-step (2 marks) ---
const mathMock1Questions: Question[] = [
  Q(
    "math-p1-q1",
    "What is 125 × 8?",
    "900",
    "1000",
    "1100",
    "850",
    1,
    "Working: 125 × 8 = (100 + 25) × 8 = 800 + 200 = 1000."
  ),
  Q(
    "math-p1-q2",
    "Which decimal is equal to 3/25?",
    "0.12",
    "0.25",
    "0.75",
    "1.2",
    0,
    "Working: 3/25 = 12/100 = 0.12."
  ),
  Q(
    "math-p1-q3",
    "Express 7.05 as an improper fraction in simplest form (denominator 20).",
    "141/20",
    "140/20",
    "7/20",
    "705/100",
    0,
    "Working: 7.05 = 7 1/20 = 141/20 (simplest since 141 and 20 share gcd 1)."
  ),
  Q(
    "math-p1-q4",
    "A shirt costs $80 before GST. GST is 9%. What is the GST amount?",
    "$7.20",
    "$8.00",
    "$72.00",
    "$89.00",
    0,
    "Working: 9% of 80 = 0.09 × 80 = 7.20."
  ),
  Q(
    "math-p1-q5",
    "Simplify 12 : 18 to the simplest ratio.",
    "2 : 3",
    "3 : 2",
    "6 : 9",
    "4 : 5",
    0,
    "Working: 12 : 18 = 2 : 3 (divide by gcd 6)."
  ),
  Q(
    "math-p1-q6",
    "What is the value of 2⁴ + 3²?",
    "16",
    "25",
    "17",
    "10",
    1,
    "Working: 2⁴ = 16, 3² = 9, 16 + 9 = 25."
  ),
  Q(
    "math-p1-q7",
    "A rectangle has length 9 cm and breadth 4 cm. What is its area?",
    "13 cm²",
    "26 cm²",
    "36 cm²",
    "18 cm²",
    2,
    "Working: Area = 9 × 4 = 36 cm²."
  ),
  Q(
    "math-p1-q8",
    "Round 48.672 to the nearest tenth.",
    "48.6",
    "48.7",
    "49",
    "48.67",
    1,
    "Working: Hundredths digit is 7 ≥ 5, so 48.7."
  ),
  Q(
    "math-p1-q9",
    "Which fraction is the smallest?",
    "3/5",
    "5/8",
    "7/12",
    "2/3",
    2,
    "Working: 3/5 = 0.6, 5/8 = 0.625, 7/12 ≈ 0.583, 2/3 ≈ 0.667. Smallest is 7/12."
  ),
  Q(
    "math-p1-q10",
    "The bar chart shows books read: Ali 4, Ben 7, Cai 5. How many books did Ben read more than Ali?",
    "2",
    "3",
    "4",
    "11",
    1,
    "Working: 7 − 4 = 3."
  ),
  Q(
    "math-p1-q11",
    "(2 marks) A box has w blue pens. The number of red pens is 5 more than twice the number of blue pens. There are 35 pens in total. Find w.",
    "5",
    "10",
    "12",
    "15",
    1,
    "Working: Blue = w, Red = 2w + 5. Total w + 2w + 5 = 3w + 5 = 35 → 3w = 30 → w = 10."
  ),
  Q(
    "math-p1-q12",
    "(2 marks) The ratio of boys to girls in a club was 3 : 2. After 20% of the boys left, there were 48 boys remaining. How many girls were there?",
    "32",
    "40",
    "48",
    "60",
    1,
    "Working: 80% of boys = 48 → boys originally = 48 ÷ 0.8 = 60. Ratio 3 : 2 = 60 : girls → 1 unit = 20, girls = 2 × 20 = 40."
  ),
  Q(
    "math-p1-q13",
    "(2 marks) A rectangular piece of paper 20 cm by 12 cm has a square of side 3 cm cut from each corner, then the sides are folded to make an open box. What is the height of the box?",
    "3 cm",
    "6 cm",
    "12 cm",
    "14 cm",
    0,
    "Working: Folding up flaps of height equal to the cut square gives height = 3 cm."
  ),
  Q(
    "math-p1-q14",
    "(2 marks) The average of five numbers is 18. If one number is removed and the average of the remaining four is 16, find the removed number.",
    "20",
    "24",
    "26",
    "30",
    2,
    "Working: Sum of five = 5 × 18 = 90. Sum of four = 4 × 16 = 64. Removed = 90 − 64 = 26."
  ),
  Q(
    "math-p1-q15",
    "(2 marks) In the figure, two identical triangles are placed on a straight line as shown: a triangle with base 8 cm and height 6 cm sits on the line; a second triangle shares a vertex and has the same height. The combined shaded area is half of the total area of both triangles. What fraction of the first triangle is shaded if the shaded region is the overlap of area 12 cm²? (Total area of first triangle = ½ × 8 × 6 = 24 cm².)",
    "1/4",
    "1/2",
    "3/4",
    "1/3",
    1,
    "Working: First triangle area = ½ × 8 × 6 = 24 cm². Shaded overlap = 12 cm². Fraction = 12/24 = 1/2."
  ),
];

// --- math-mock-2 ---
const mathMock2Questions: Question[] = [
  Q(
    "math-p2-q1",
    "What is 1000 − 347?",
    "653",
    "663",
    "743",
    "553",
    0,
    "Working: 1000 − 347 = 653."
  ),
  Q(
    "math-p2-q2",
    "Convert 5/8 to a percentage.",
    "62.5%",
    "58%",
    "0.625%",
    "80%",
    0,
    "Working: 5/8 = 0.625 = 62.5%."
  ),
  Q(
    "math-p2-q3",
    "Which is the largest?",
    "0.505",
    "0.55",
    "0.5",
    "0.055",
    1,
    "Working: 0.55 > 0.505 > 0.5 > 0.055."
  ),
  Q(
    "math-p2-q4",
    "Simplify 1.2 km + 450 m in metres.",
    "1650 m",
    "120450 m",
    "1.65 m",
    "1200 m",
    0,
    "Working: 1.2 km = 1200 m; 1200 + 450 = 1650 m."
  ),
  Q(
    "math-p2-q5",
    "A pie chart sector is 90° of a circle. What fraction of the whole is this?",
    "1/4",
    "1/2",
    "3/4",
    "1/3",
    0,
    "Working: 90/360 = 1/4."
  ),
  Q(
    "math-p2-q6",
    "If 4x − 7 = 13, what is x?",
    "3",
    "4",
    "5",
    "6",
    2,
    "Working: 4x = 20 → x = 5."
  ),
  Q(
    "math-p2-q7",
    "A cube has edge 3 cm. What is its volume?",
    "9 cm³",
    "18 cm³",
    "27 cm³",
    "36 cm³",
    2,
    "Working: 3³ = 27 cm³."
  ),
  Q(
    "math-p2-q8",
    "Find the perimeter of a square with side 6.5 cm.",
    "26 cm",
    "42.25 cm",
    "13 cm",
    "32 cm",
    0,
    "Working: 4 × 6.5 = 26 cm."
  ),
  Q(
    "math-p2-q9",
    "Which number is a prime?",
    "91",
    "97",
    "87",
    "51",
    1,
    "Working: 97 has no divisors other than 1 and 97; others are composite (91 = 7×13, etc.)."
  ),
  Q(
    "math-p2-q10",
    "Subtract 2/3 from 1 1/4. Answer as a fraction in simplest form.",
    "7/12",
    "11/12",
    "2/3",
    "5/12",
    1,
    "Working: 5/4 − 2/3 = 15/12 − 8/12 = 7/12."
  ),
  Q(
    "math-p2-q11",
    "(2 marks) Mary has $3y. Tom has $(4y − 5). Together they have $72. Find y.",
    "9",
    "10",
    "11",
    "12",
    2,
    "Working: 3y + 4y − 5 = 72 → 7y = 77 → y = 11."
  ),
  Q(
    "math-p2-q12",
    "(2 marks) The ratio of boys to girls in a choir is 4 : 5. If there are 24 boys, how many girls are there?",
    "25",
    "28",
    "30",
    "32",
    2,
    "Working: 4 units = 24 → 1 unit = 6. Girls = 5 × 6 = 30."
  ),
  Q(
    "math-p2-q13",
    "(2 marks) A tank is 2/5 full. Adding 35 litres makes it 3/4 full. Find the capacity (L).",
    "80",
    "100",
    "120",
    "140",
    1,
    "Working: 3/4 − 2/5 = 7/20 of capacity = 35 L → C = 35 × 20/7 = 100 L."
  ),
  Q(
    "math-p2-q14",
    "(2 marks) The average height of 4 boys is 1.52 m. After a 5th boy joins, the average is 1.48 m. Find the 5th boy’s height in metres.",
    "1.32",
    "1.36",
    "1.40",
    "1.44",
    0,
    "Working: Sum of 4 = 4 × 1.52 = 6.08. Sum of 5 = 5 × 1.48 = 7.40. Fifth = 7.40 − 6.08 = 1.32 m."
  ),
  Q(
    "math-p2-q15",
    "(2 marks) A right-angled triangle has legs 6 cm and 8 cm. What is the length of the hypotenuse?",
    "9 cm",
    "10 cm",
    "12 cm",
    "14 cm",
    1,
    "Working: √(6² + 8²) = √(36 + 64) = √100 = 10 cm."
  ),
];

// --- math-mock-3 ---
const mathMock3Questions: Question[] = [
  Q(
    "math-p3-q1",
    "What is 0.08 × 500?",
    "4",
    "40",
    "400",
    "0.4",
    1,
    "Working: 0.08 × 500 = 40."
  ),
  Q(
    "math-p3-q2",
    "Divide 5 by 8 and express the answer as a decimal.",
    "0.58",
    "0.625",
    "0.65",
    "0.125",
    1,
    "Working: 5 ÷ 8 = 0.625."
  ),
  Q(
    "math-p3-q3",
    "Which inequality is true?",
    "2/7 > 1/3",
    "0.3 < 1/3",
    "15% > 1/5",
    "0.09 > 0.1",
    1,
    "Working: 1/3 ≈ 0.333; 0.3 < 0.333. Others false."
  ),
  Q(
    "math-p3-q4",
    "Simplify 15a − 8a + 3a.",
    "10a",
    "20a",
    "26a",
    "7a",
    0,
    "Working: (15 − 8 + 3)a = 10a."
  ),
  Q(
    "math-p3-q5",
    "A line graph shows temperature at 8 a.m. 22°C, noon 30°C, 4 p.m. 28°C. What is the rise from 8 a.m. to noon?",
    "6°C",
    "8°C",
    "10°C",
    "52°C",
    1,
    "Working: 30 − 22 = 8°C."
  ),
  Q(
    "math-p3-q6",
    "What is (−3) + 7 + (−4)?",
    "0",
    "1",
    "−1",
    "14",
    0,
    "Working: −3 + 7 = 4; 4 − 4 = 0."
  ),
  Q(
    "math-p3-q7",
    "A circle has radius 7 cm (take π = 22/7). What is the circumference?",
    "22 cm",
    "44 cm",
    "154 cm",
    "49 cm",
    1,
    "Working: C = 2πr = 2 × 22/7 × 7 = 44 cm."
  ),
  Q(
    "math-p3-q8",
    "Express 45 minutes as a fraction of 2 hours in simplest form.",
    "3/8",
    "9/24",
    "1/4",
    "45/120",
    0,
    "Working: 45 min / 120 min = 3/8."
  ),
  Q(
    "math-p3-q9",
    "If 2 pencils cost $1.20, how much do 7 pencils cost?",
    "$4.00",
    "$4.20",
    "$4.80",
    "$8.40",
    1,
    "Working: Each = $0.60; 7 × 0.60 = $4.20."
  ),
  Q(
    "math-p3-q10",
    "A number is doubled and 5 is added. The result is 31. What is the number?",
    "12",
    "13",
    "18",
    "36",
    1,
    "Working: 2n + 5 = 31 → 2n = 26 → n = 13."
  ),
  Q(
    "math-p3-q11",
    "(2 marks) There are 3 times as many coins in Box A as in Box B. If 12 coins are moved from A to B, both boxes have the same number. How many coins were in Box A at first?",
    "36",
    "42",
    "48",
    "54",
    0,
    "Working: Let B = x, A = 3x. After: 3x − 12 = x + 12 → 2x = 24 → x = 12. A at first = 36."
  ),
  Q(
    "math-p3-q12",
    "(2 marks) In a sale, a bag is sold at 15% off the usual price of $240. What is the sale price?",
    "$200",
    "$204",
    "$216",
    "$225",
    1,
    "Working: Discount = 0.15 × 240 = 36; sale = 240 − 36 = 204."
  ),
  Q(
    "math-p3-q13",
    "(2 marks) A cuboid is 5 cm by 4 cm by 3 cm. What is the total surface area?",
    "60 cm²",
    "74 cm²",
    "94 cm²",
    "120 cm²",
    2,
    "Working: SA = 2(5×4 + 4×3 + 5×3) = 2(20 + 12 + 15) = 94 cm²."
  ),
  Q(
    "math-p3-q14",
    "(2 marks) The pie chart shows transport: Walk 120°, Bus 100°, MRT 80°, Car 60°. What fraction travel by bus?",
    "5/18",
    "5/12",
    "2/9",
    "1/4",
    0,
    "Working: 100/360 = 5/18."
  ),
  Q(
    "math-p3-q15",
    "(2 marks) The sum of three consecutive whole numbers is 84. Find the largest number.",
    "27",
    "28",
    "29",
    "30",
    2,
    "Working: Let n, n+1, n+2. Sum = 3n + 3 = 84 → n = 27. Largest = 29."
  ),
];

// --- math-mock-4 ---
const mathMock4Questions: Question[] = [
  Q(
    "math-p4-q1",
    "What is 3/4 + 1/6?",
    "10/12",
    "11/12",
    "4/10",
    "5/6",
    1,
    "Working: 9/12 + 2/12 = 11/12."
  ),
  Q(
    "math-p4-q2",
    "Round 3.499 to two decimal places.",
    "3.40",
    "3.49",
    "3.50",
    "3.48",
    2,
    "Working: Third decimal is 9 ≥ 5, so 3.50."
  ),
  Q(
    "math-p4-q3",
    "Which angle is obtuse?",
    "75°",
    "90°",
    "120°",
    "45°",
    2,
    "Working: Obtuse is between 90° and 180°."
  ),
  Q(
    "math-p4-q4",
    "If y = 3x − 2 and x = 4, what is y?",
    "10",
    "12",
    "14",
    "5",
    0,
    "Working: y = 3(4) − 2 = 10."
  ),
  Q(
    "math-p4-q5",
    "A bag has 2 red and 5 blue balls. What fraction are red?",
    "2/5",
    "2/7",
    "5/7",
    "3/7",
    1,
    "Working: 2/(2+5) = 2/7."
  ),
  Q(
    "math-p4-q6",
    "What is 1.2 ÷ 0.03?",
    "0.4",
    "4",
    "40",
    "400",
    2,
    "Working: 1.2/0.03 = 120/3 = 40."
  ),
  Q(
    "math-p4-q7",
    "A trapezium has parallel sides 6 cm and 10 cm, height 5 cm. What is the area?",
    "30 cm²",
    "40 cm²",
    "50 cm²",
    "80 cm²",
    1,
    "Working: ½(6+10)×5 = 40 cm²."
  ),
  Q(
    "math-p4-q8",
    "The table shows test marks: Ali 66, Ben 72, Cai 78. What is the mean?",
    "70",
    "71",
    "72",
    "73",
    2,
    "Working: (66 + 72 + 78) ÷ 3 = 216 ÷ 3 = 72."
  ),
  Q(
    "math-p4-q9",
    "Which number line description fits: start at −2, move 5 units to the right?",
    "−7",
    "3",
    "7",
    "−3",
    1,
    "Working: −2 + 5 = 3."
  ),
  Q(
    "math-p4-q10",
    "Simplify 18 : 12 : 6 to the simplest ratio with whole numbers.",
    "3 : 2 : 1",
    "6 : 4 : 2",
    "9 : 6 : 3",
    "18 : 12 : 6",
    0,
    "Working: Divide by gcd 6 → 3 : 2 : 1."
  ),
  Q(
    "math-p4-q11",
    "(2 marks) A shop mixes coffee A at $8/kg and coffee B at $12/kg to get 20 kg of mixture at $9.20/kg. How many kg of A were used?",
    "12",
    "14",
    "15",
    "16",
    1,
    "Working: Let a kg of A, (20−a) of B. 8a + 12(20−a) = 9.2×20 = 184 → 8a + 240 − 12a = 184 → −4a = −56 → a = 14."
  ),
  Q(
    "math-p4-q12",
    "(2 marks) In the diagram (described): ABCD is a parallelogram with AB = 10 cm, height from D to AB = 6 cm. What is the area of ABCD?",
    "30 cm²",
    "60 cm²",
    "100 cm²",
    "120 cm²",
    1,
    "Working: Area = base × height = 10 × 6 = 60 cm²."
  ),
  Q(
    "math-p4-q13",
    "(2 marks) If 5 machines make 120 parts in 4 hours, how many parts would 3 machines make in 2 hours at the same rate?",
    "36",
    "40",
    "45",
    "48",
    0,
    "Working: One machine: 120/(5×4) = 6 parts per hour. 3 machines × 2 h × 6 = 36."
  ),
  Q(
    "math-p4-q14",
    "(2 marks) Solve 2(x + 3) = 5x − 9.",
    "3",
    "4",
    "5",
    "6",
    2,
    "Working: 2x + 6 = 5x − 9 → 15 = 3x → x = 5."
  ),
  Q(
    "math-p4-q15",
    "(2 marks) A rectangular tank 40 cm by 30 cm contains water to depth 15 cm. The water is poured into a cube tank of edge 20 cm. What is the depth of water in the cube tank (cm)?",
    "40",
    "42.5",
    "45",
    "48",
    2,
    "Working: Volume = 40×30×15 = 18000 cm³. Cube base = 400 cm². Depth = 18000/400 = 45 cm."
  ),
];

// --- math-mock-5 ---
const mathMock5Questions: Question[] = [
  Q(
    "math-p5-q1",
    "What is 7/8 − 1/4?",
    "5/8",
    "6/8",
    "1/2",
    "3/4",
    0,
    "Working: 7/8 − 2/8 = 5/8."
  ),
  Q(
    "math-p5-q2",
    "Increase 200 by 15%.",
    "215",
    "230",
    "300",
    "205",
    1,
    "Working: 200 × 1.15 = 230."
  ),
  Q(
    "math-p5-q3",
    "A triangle has angles 50° and 60°. What is the third angle?",
    "60°",
    "70°",
    "80°",
    "130°",
    1,
    "Working: 180 − 50 − 60 = 70°."
  ),
  Q(
    "math-p5-q4",
    "What is the value of 10³ − 10²?",
    "0",
    "90",
    "900",
    "1000",
    2,
    "Working: 1000 − 100 = 900."
  ),
  Q(
    "math-p5-q5",
    "Simplify 4(2m − 3) + m.",
    "8m − 3",
    "9m − 12",
    "9m − 3",
    "8m − 12",
    1,
    "Working: 8m − 12 + m = 9m − 12."
  ),
  Q(
    "math-p5-q6",
    "A regular hexagon has perimeter 36 cm. What is the length of one side?",
    "4 cm",
    "5 cm",
    "6 cm",
    "9 cm",
    2,
    "Working: 36/6 = 6 cm."
  ),
  Q(
    "math-p5-q7",
    "The pictogram uses one symbol for 8 books. Ali has 3 symbols. How many books?",
    "11",
    "24",
    "32",
    "38",
    1,
    "Working: 3 × 8 = 24."
  ),
  Q(
    "math-p5-q8",
    "Which point is south of point P on a map with North at the top?",
    "The point directly above P",
    "The point directly below P",
    "The point left of P",
    "The point right of P",
    1,
    "Working: South is toward the bottom when North is up (basic map direction; not 8-point compass)."
  ),
  Q(
    "math-p5-q9",
    "Find the HCF of 24 and 36.",
    "4",
    "6",
    "12",
    "72",
    2,
    "Working: 24 = 2³×3, 36 = 2²×3² → HCF = 2²×3 = 12."
  ),
  Q(
    "math-p5-q10",
    "A ribbon 2.4 m is cut into 8 equal pieces. How long is each piece (m)?",
    "0.3",
    "0.4",
    "3.0",
    "19.2",
    0,
    "Working: 2.4 ÷ 8 = 0.3 m."
  ),
  Q(
    "math-p5-q11",
    "(2 marks) The LCM of two numbers is 180. One number is 36. Which could be the other number?",
    "24",
    "45",
    "54",
    "60",
    1,
    "Working: LCM(36, 45) = 180 since 36 = 2²×3², 45 = 3²×5 → LCM = 2²×3²×5 = 180."
  ),
  Q(
    "math-p5-q12",
    "(2 marks) A shopkeeper marks a bag at $400 and gives a 20% discount. He still makes 25% profit on cost. Find the cost price.",
    "$240",
    "$256",
    "$300",
    "$320",
    1,
    "Working: Selling = 0.8 × 400 = $320. Cost × 1.25 = 320 → cost = 256."
  ),
  Q(
    "math-p5-q13",
    "(2 marks) Two identical triangles each have base 12 cm and height 5 cm. What is the combined area of the two triangles?",
    "45 cm²",
    "60 cm²",
    "75 cm²",
    "90 cm²",
    1,
    "Working: Each area = ½×12×5 = 30 cm². Combined = 30 + 30 = 60 cm²."
  ),
  Q(
    "math-p5-q14",
    "(2 marks) The sum of two numbers is 48 and their ratio is 5 : 3. Find the larger number.",
    "25",
    "28",
    "30",
    "32",
    2,
    "Working: 5k + 3k = 48 → k = 6. Larger = 5×6 = 30."
  ),
  Q(
    "math-p5-q15",
    "(2 marks) A water tank in the shape of a cylinder has radius 7 cm and height 10 cm (π = 22/7). What is the volume of water when full?",
    "1540 cm³",
    "15400 cm³",
    "2200 cm³",
    "4400 cm³",
    0,
    "Working: V = πr²h = 22/7 × 49 × 10 = 1540 cm³."
  ),
];

export const examPapers: ExamPaperSeed[] = [
  {
    paperId: "science-mock-1",
    subjectId: "science",
    title: "PSLE 2026-style Science Mock Paper 1",
    description: "Diversity theme; inquiry and data interpretation; linked MCQs included.",
    questions: scienceMock1Questions,
  },
  {
    paperId: "science-mock-2",
    subjectId: "science",
    title: "PSLE 2026-style Science Mock Paper 2",
    description: "Cycles theme; water, carbon, and matter cycles; linked MCQs included.",
    questions: scienceMock2Questions,
  },
  {
    paperId: "science-mock-3",
    subjectId: "science",
    title: "PSLE 2026-style Science Mock Paper 3",
    description: "Systems theme: body, plant transport, and electrical systems; linked MCQs included.",
    questions: scienceMock3Questions,
  },
  {
    paperId: "science-mock-4",
    subjectId: "science",
    title: "PSLE 2026-style Science Mock Paper 4",
    description: "Interactions theme: feeding, forces, and environment; linked MCQs included.",
    questions: scienceMock4Questions,
  },
  {
    paperId: "science-mock-5",
    subjectId: "science",
    title: "PSLE 2026-style Science Mock Paper 5",
    description: "Energy theme: transfers, resources, and dissipation; linked MCQs included.",
    questions: scienceMock5Questions,
  },
  {
    paperId: "math-mock-1",
    subjectId: "math",
    title: "PSLE 2026-style Mathematics Mock Paper 1",
    description: "Booklet A style: 10 short + 5 multi-step (algebra, ratio, average, geometry).",
    questions: mathMock1Questions,
  },
  {
    paperId: "math-mock-2",
    subjectId: "math",
    title: "PSLE 2026-style Mathematics Mock Paper 2",
    description: "Whole numbers, fractions, decimals, percentages, ratio, algebra, geometry, data.",
    questions: mathMock2Questions,
  },
  {
    paperId: "math-mock-3",
    subjectId: "math",
    title: "PSLE 2026-style Mathematics Mock Paper 3",
    description: "Mixed topics with emphasis on algebra and ratio in longer items.",
    questions: mathMock3Questions,
  },
  {
    paperId: "math-mock-4",
    subjectId: "math",
    title: "PSLE 2026-style Mathematics Mock Paper 4",
    description: "Geometry, graphs, and word problems; no speed or 8-point compass.",
    questions: mathMock4Questions,
  },
  {
    paperId: "math-mock-5",
    subjectId: "math",
    title: "PSLE 2026-style Mathematics Mock Paper 5",
    description: "Percentages, LCM/HCF, volume, and multi-step reasoning.",
    questions: mathMock5Questions,
  },
];

