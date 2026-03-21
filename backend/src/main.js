import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./db.js";
import { getEnvVar } from "./getEnvVar.js";
import { Resume } from "./models/Resume.js";
import { User } from "./models/User.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const JWT_SECRET = getEnvVar("JWT_SECRET", false) || "dev-secret-change-me";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

app.use(
  cors({
    origin: getEnvVar("FRONTEND_ORIGIN", false) || "http://localhost:5173",
  })
);
app.use(express.json());

function scoreForRole(role) {
  const roleScore = {
    "UX Designer": 84,
    "Product Manager": 87,
    "Data Analyst": 90,
    "Marketing Manager": 78,
    "Product Analyst": 80,
  };
  return roleScore[role] ?? 75;
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

function serializeResume(resume) {
  return {
    id: resume._id.toString(),
    name: resume.name,
    targetRole: resume.targetRole,
    score: resume.score,
    isPublic: resume.isPublic,
    sharedBy: resume.sharedBy,
    createdAt: resume.createdAt,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

async function authMiddleware(req, res, next) {
  const header = req.get("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Missing auth token." });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(401).json({ error: "Invalid auth token." });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid auth token." });
  }
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ error: "An account with that email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = createToken(user);

  res.status(201).json({
    token,
    user: serializeUser(user),
  });
});

app.post("/api/auth/login", async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = createToken(user);
  res.json({
    token,
    user: serializeUser(user),
  });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

app.get("/api/resumes", authMiddleware, async (req, res) => {
  const resumes = await Resume.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  res.json({ resumes: resumes.map(serializeResume) });
});

app.post("/api/resumes", authMiddleware, async (req, res) => {
  const targetRole = req.body?.targetRole?.trim();
  const name = req.body?.name?.trim() || (targetRole ? `${targetRole} Resume` : "");
  const isPublic = Boolean(req.body?.isPublic);

  if (!targetRole || !name) {
    res.status(400).json({ error: "Resume name and target role are required." });
    return;
  }

  const resume = await Resume.create({
    ownerId: req.user._id,
    name,
    targetRole,
    score: scoreForRole(targetRole),
    isPublic,
    sharedBy: req.user.name,
  });

  res.status(201).json({ resume: serializeResume(resume) });
});

app.get("/api/resumes/:resumeId", authMiddleware, async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.resumeId,
    ownerId: req.user._id,
  });

  if (!resume) {
    res.status(404).json({ error: "Resume not found." });
    return;
  }

  res.json({ resume: serializeResume(resume) });
});

app.get("/api/public-resumes", async (req, res) => {
  const resumes = await Resume.find({ isPublic: true }).sort({ createdAt: -1 }).limit(20);
  res.json({ resumes: resumes.map(serializeResume) });
});

app.use((error, req, res, next) => {
  if (error?.name === "CastError") {
    res.status(404).json({ error: "Resource not found." });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Server error." });
});

app.use(express.static(frontendDistPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}. CTRL+C to stop.`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB.", error);
    process.exit(1);
  });
