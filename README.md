# LearnBright

An educational web platform for primary school students to learn Math and Science through video lessons and practice quizzes.

## Architecture Overview

The application is split into three components, each running in its own Docker container:

```
learnbright/
├── client/          # React frontend (Vite)
├── server/          # Express.js backend API
├── docker-compose.yml
└── package.json     # Root-level convenience scripts
```

### Client (`client/`)

The frontend is a **React 19** single-page application built with **Vite**.

**Tech stack:**
- **React 19** with TypeScript
- **React Router v7** for client-side routing
- **Tailwind CSS v4** for styling
- **shadcn/ui** (Radix UI + CVA) for UI components
- **Lucide React** for icons

**What is Vite?**

Vite is the build tool and dev server for the frontend. Unlike traditional bundlers (Webpack, etc.), Vite serves source files directly to the browser using native ES modules during development, making hot module replacement (HMR) near-instant. When you edit a React component, the change reflects in the browser within milliseconds without a full page reload.

In our Docker setup, the Vite dev server runs inside the `client` container on port **5173**, with volume mounts on `src/`, `public/`, and `index.html` so that local file changes trigger HMR automatically.

**Key directories:**

```
client/src/
├── main.tsx                # React entry point
├── App.tsx                 # Router + ProgressProvider
├── index.css               # Tailwind v4 config + CSS variables
├── pages/                  # One file per route
│   ├── HomePage.tsx            /
│   ├── LearnPage.tsx           /learn
│   ├── SubjectLearnPage.tsx    /learn/:subjectId
│   ├── TopicLessonPage.tsx     /learn/:subjectId/:topicId
│   ├── PracticePage.tsx        /practice
│   ├── SubjectPracticePage.tsx /practice/:subjectId
│   ├── TopicQuizPage.tsx       /practice/:subjectId/:topicId
│   ├── DashboardPage.tsx       /dashboard
│   └── NotFoundPage.tsx        *
├── components/             # Reusable UI components
│   ├── Navigation.tsx
│   ├── SubjectCard.tsx
│   ├── TopicCard.tsx
│   ├── VideoPlayer.tsx     # Simulated video player
│   ├── Quiz.tsx            # Interactive quiz
│   └── ui/                 # shadcn/ui primitives (button, card, progress)
├── context/
│   └── progress-context.tsx  # Student progress (localStorage)
├── services/
│   └── api.ts              # API client for the backend
├── types/
│   └── index.ts            # Shared TypeScript interfaces
└── lib/
    └── utils.ts            # Tailwind class merging utility
```

### Server (`server/`)

The backend is an **Express.js** REST API written in TypeScript.

**Tech stack:**
- **Express 4** with TypeScript
- **Dynamoose v4** as the DynamoDB ODM (Object-Document Mapper)
- **tsx** for TypeScript execution and file watching in development

**Key directories:**

```
server/src/
├── index.ts                # Entry point — DB init, seed, start server
├── app.ts                  # Express app setup (CORS, JSON, routes)
├── types/
│   └── index.ts            # TypeScript interfaces (Subject, Topic, Lesson, Question)
├── models/
│   └── Subject.ts          # Dynamoose model with nested schemas
├── db/
│   ├── index.ts            # DynamoDB connection config
│   └── seed.ts             # Idempotent seed script
├── data/
│   └── subjects.ts         # Hardcoded seed data (Math + Science)
├── routes/
│   ├── index.ts            # Route aggregator (/api/learn, /api/practice)
│   ├── learn.ts            # Learning routes
│   └── practice.ts         # Practice/quiz routes
└── controllers/
    ├── learn.controller.ts     # Queries DynamoDB for learn endpoints
    └── practice.controller.ts  # Queries DynamoDB for practice endpoints
```

**API endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/learn/subjects` | All subjects (topics without questions) |
| GET | `/api/learn/subjects/:id` | Single subject with topics/lessons |
| GET | `/api/learn/subjects/:id/topics/:topicId` | Single topic with lessons |
| GET | `/api/practice/subjects` | All subjects (topics with question count) |
| GET | `/api/practice/subjects/:id/topics/:topicId/questions` | Quiz questions |

### DynamoDB (`dynamodb-local`)

We use **Amazon DynamoDB Local** as a Docker container for local development. This is the same DynamoDB engine that runs on AWS, packaged as a local Java application.

**How it works:**
- Runs the official `amazon/dynamodb-local` Docker image
- Uses `-sharedDb` mode so all operations share a single database file
- Data persists to `~/dev/cs5224/dynamodb-data` on the host via a volume mount
- The server connects using dummy AWS credentials (`local`/`local`) since DynamoDB Local doesn't enforce authentication

**ODM — Dynamoose:**

Dynamoose is a Mongoose-like modeling tool for DynamoDB. It provides:
- Schema definitions with validation (see `server/src/models/Subject.ts`)
- CRUD operations (`get`, `scan`, `batchPut`, etc.)
- Automatic type serialization for nested objects and arrays

The `Subject` model stores each subject as a single DynamoDB item with nested topics, lessons, and questions. This works well because our items are small (~5KB) and well under DynamoDB's 400KB item size limit.

**Data model:**

```
Table: Subjects
  Partition Key: id (String) — e.g. "math", "science"
  Attributes: name, description, icon, color, topics[]
    Each topic: id, title, description, icon, lessons[], questions[]
```

## Docker Setup

All three services are orchestrated via `docker-compose.yml`:

| Service | Port | Description |
|---------|------|-------------|
| `client` | 5173 | Vite dev server (React app) |
| `server` | 3001 | Express API |
| `dynamodb-local` | 8000 | DynamoDB Local |

**Hot reload:** Both the client and server have their `src/` directories mounted as Docker volumes, so code changes on your host machine are reflected instantly:
- Client: Vite HMR updates the browser automatically
- Server: `tsx watch` detects file changes and restarts the process

**Startup order:** The server depends on `dynamodb-local` and retries its database connection (up to 10 times, 3 seconds apart) to handle the case where DynamoDB Local hasn't fully started yet. The server also has `restart: unless-stopped` as a safety net.

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** (via Docker Desktop, OrbStack, or similar)
- **Node.js 18+** and **pnpm** (for installing dependencies)
- **AWS CLI** (for deploying to AWS)
- **Terraform** (for provisioning infrastructure — only needed if modifying infra)

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd v0-demo
```

**Install AWS CLI v2:**

```bash
# macOS
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
rm AWSCLIV2.pkg

# Windows
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

**Install Terraform** (only needed if modifying infrastructure):

```bash
# macOS
HOMEBREW_NO_AUTO_UPDATE=1 brew install hashicorp/tap/terraform

# Windows — download from https://developer.hashicorp.com/terraform/install
```

**Configure AWS credentials:**

```bash
aws configure
# Enter your Access Key ID, Secret Access Key, and region (ap-southeast-1)
```

**Install project dependencies:**

```bash
npm run install:all
```

### 2. Create the DynamoDB data directory

```bash
mkdir -p ~/dev/cs5224/dynamodb-data
```

### 3. Start everything

```bash
# Build and start all containers in the background
npm run dev

# Or, to see logs in the foreground:
npm run dev:logs
```

This starts:
- DynamoDB Local on http://localhost:8000
- Express API on http://localhost:3001
- Vite dev server on http://localhost:5173

The server will automatically create the `Subjects` table and seed it with Math and Science data on first boot.

### 4. Open the app

Visit **http://localhost:5173** in your browser.

### Convenience Scripts

All scripts are defined in the root `package.json`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Build and start all containers (background) |
| `npm run dev:logs` | Build and start all containers (foreground, with logs) |
| `npm run stop` | Stop all containers |
| `npm run restart` | Stop, rebuild, and start all containers |
| `npm run logs` | Tail logs from all containers |
| `npm run logs:server` | Tail server logs only |
| `npm run logs:client` | Tail client logs only |
| `npm run logs:db` | Tail DynamoDB Local logs only |
| `npm run install:all` | Install dependencies for both client and server |
| `npm run install:client` | Install client dependencies only |
| `npm run install:server` | Install server dependencies only |
| `npm run clean` | Stop containers, remove images and volumes |

### Troubleshooting

**Server crashes with ECONNREFUSED on startup:**
This happens when the server starts before DynamoDB Local is ready. The server retries automatically (up to 10 times). With `restart: unless-stopped`, Docker will also restart the container if it crashes. Wait ~30 seconds and check `npm run logs:server`.

**DynamoDB data not persisting:**
Ensure `~/dev/cs5224/dynamodb-data` exists and is writable. The `dynamodb-local` container runs as root to avoid permission issues with the volume mount.

**Port conflicts:**
If ports 5173, 3001, or 8000 are already in use, stop the conflicting services or change the port mappings in `docker-compose.yml`.

## AWS Deployment

The app is deployed to AWS using Terraform for infrastructure and a deploy script for code.

### Architecture

```
Users → CloudFront (HTTPS) → S3 (static React app)
              ↓ (/api/*)
           ALB → ECS Fargate (Express container)
                      ↓
                  DynamoDB (managed)
```

**CloudFront** sits in front of everything as a single entry point:
- `/*` → serves the React SPA from **S3**
- `/api/*` and `/health` → proxies to the **ALB**, which routes to the Express container on **ECS Fargate**

This means the frontend and API share the same domain — no CORS issues, no mixed HTTP/HTTPS content.

### Infrastructure (Terraform)

**Modifying infrastructure:**

Only people who need to change AWS resources need Terraform installed. Everyone else just runs the deploy script. See below this section.


All infrastructure is defined in `terraform/` and managed via [HCP Terraform](https://app.terraform.io):

| File | What it provisions |
|------|-------------------|
| `main.tf` | HCP Terraform backend + AWS provider |
| `variables.tf` | Configurable inputs (region, app name, CPU/memory) |
| `outputs.tf` | URLs and resource names used by the deploy script |
| `network.tf` | VPC, 2 public subnets, internet gateway, security groups, DynamoDB VPC endpoint |
| `iam.tf` | ECS execution role (pull images) + task role (DynamoDB access) |
| `dynamodb.tf` | `Subjects` table with on-demand billing |
| `ecr.tf` | Docker image registry + auto-cleanup of old images |
| `alb.tf` | Application Load Balancer with health check on `/health` |
| `ecs.tf` | Fargate cluster, task definition (0.25 vCPU, 512 MB), service with circuit breaker |
| `s3.tf` | Private S3 bucket for frontend static files |
| `cloudfront.tf` | CDN with two origins (S3 for frontend, ALB for API) |

**First-time setup:**

1. Create an [HCP Terraform](https://app.terraform.io) account, organization, and workspace
2. Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` as environment variables in the workspace
3. Update `terraform/main.tf` with your organization and workspace names
4. Run:

```bash
cd terraform
terraform init
terraform apply
```

### Deploying Code

After infrastructure is up, deploy with:

```bash
npm run deploy
```

This:
1. Builds the server Docker image (linux/amd64) and pushes to ECR
2. Triggers ECS to pull the new image
3. Builds the client inside Docker and uploads static files to S3
4. Invalidates the CloudFront cache

**Teammates without Terraform** can deploy by setting env vars instead:

```bash
export ECR_REPO="<ecr-repo-url>"
export S3_BUCKET="<s3-bucket-name>"
export CF_DIST_ID="<cloudfront-distribution-id>"
export ECS_CLUSTER="learnbright-cluster"
export ECS_SERVICE="learnbright-api"
npm run deploy
```

### Production Scripts

| Command | Description |
|---------|-------------|
| `npm run deploy` | Build and deploy both frontend and backend to AWS |
| `npm run deploy:infra` | Apply Terraform changes (provision/update infrastructure) |
| `npm run deploy:destroy` | Tear down all AWS infrastructure |
| `npm run deploy:logs` | Tail live server logs from CloudWatch |

## Features

- **Learning:** Browse Math and Science subjects, pick a topic, and watch simulated video lessons
- **Practice:** Take multiple-choice quizzes per topic with instant feedback and explanations
- **Dashboard:** Track total points, level progression, lessons completed, quiz accuracy, and 6 unlockable achievements
- **Progress:** Stored in browser localStorage (points, levels, achievements, per-lesson and per-quiz tracking)
- **Responsive:** Mobile hamburger menu, responsive grid layouts

## Student Dashboard Analytics (Section 3)

The dashboard now includes student-centric analytics and a backend event pipeline:

- **KPI cards:** 7-day accuracy, lessons completed, current streak, and time spent (7 days)
- **Trends:** 7-day daily accuracy trend and points earned this week vs last week
- **Diagnostics:** weak topics (mastery + accuracy) and next-best-action recommendation
- **Progress:** subject completion bars plus existing level progression and achievements

### Event instrumentation

Authenticated analytics events are tracked to `POST /api/analytics/events` and summarized by `GET /api/analytics/dashboard-summary`.

Event types:

- `lesson_start`
- `lesson_complete`
- `quiz_start`
- `question_answered`
- `quiz_complete`
- `dashboard_view`

Key properties include:

- user and content identifiers (`userId`, `subjectId`, `topicId`, `lessonId`, `questionId`)
- scoring fields (`isCorrect`, `score`, `totalQuestions`, `attemptNumber`)
- engagement fields (`durationSeconds`, `pointsEarned`)
- event timestamp (`createdAt`)

### Rollout phases and acceptance criteria

- **Phase 1 (fast):** dashboard UI surfaces KPI/trend/weak-topic cards from available data
- **Phase 2 (reliable):** backend ingestion + persistence (`AnalyticsEvents`) supports cross-device and time-series analytics
- **Phase 3 (smart):** recommendation logic prioritizes weakest topic for guided next steps

Acceptance criteria:

- Student can identify weakest topic in under 10 seconds
- Student can compare week-over-week progress (accuracy, time spent, points)
- Recommendation card updates based on tracked learning/quiz behavior
