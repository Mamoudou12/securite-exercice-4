import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

// Ajoute le middleware pour lire les données JSON dans le corps des requêtes
app.use(express.json());

const PORT = 3020;
const users = [
  {
    id: 1,
    email: "user@example.com",
    password: bcrypt.hashSync("password123", 8), // Hachons le mot de passe
  },
];

// Clé secrète pour signer le JWT
const JWT_SECRET = "mysecretkey";

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Vérifie si l'utilisateur existe
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  // Vérifie le mot de passe
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Mot de passe incorrect" });
  }

  // Génère un token JWT valide pendant 1h
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  // Renvoie le token
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
