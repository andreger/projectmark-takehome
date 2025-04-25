import express from "express";
import authRoutes from "./auth/auth.routes";
import topicRoutes from "./topic/topic.routes";
import userRoutes from "./user/user.routes";
import { authenticate } from "./auth/middleware/authenticate";

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/users", userRoutes);

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: `Hello ${req.user?.email}!` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
