// server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());


app.use(express.json());
app.use(cors()); // autoriser les appels depuis le frontend
const multer = require('multer');
const path = require('path');




const publicationsPath = path.join(__dirname, 'publications.json');

function lireJSON(fichier) {
  try {
    const data = fs.readFileSync(fichier, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur de lecture JSON :", err.message);
    return [];
  }
}

function ecrireJSON(fichier, data) {
  fs.writeFileSync(fichier, JSON.stringify(data, null, 2));
}
// Servir les images uploadées dans /uploads
app.use('/uploads', express.static('uploads'));

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), 
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const PORT = 3001;

// Charger les publications
const loadPublications = () => {
  if (fs.existsSync("publications.json")) {
    return JSON.parse(fs.readFileSync("publications.json"));
  }
  return [];
};

//charger message 
const loadMessages = () => {
  if (fs.existsSync("messages.json")) {
    return JSON.parse(fs.readFileSync("messages.json"));
  }
  return [];
};




/// gestion adminstrateur
const adminsPath = path.join(__dirname, 'admins.json');

function lireAdmins() {
  try {
    const data = fs.readFileSync(adminsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function ecrireAdmins(data) {
  fs.writeFileSync(adminsPath, JSON.stringify(data, null, 2));
}

// Pour servir les fichiers statiques du dossier "uploads"
app.use('/uploads', express.static('uploads'));

//gérer les donné du site 
const siteContentPath = path.join(__dirname, 'siteContent.json');

function lireSiteContent() {
  try {
    const data = fs.readFileSync(siteContentPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function ecrireSiteContent(data) {
  fs.writeFileSync(siteContentPath, JSON.stringify(data, null, 2));
}

const messagesPath = path.join(__dirname, 'messages.json');

// === ROUTES ===

// Connexion simple
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const adminList = JSON.parse(fs.readFileSync("admins.json", "utf-8"));
  const user = adminList.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({
      success: true,
      username: user.username,
      nom: user.nom,
      niveau: user.niveau
    });
  } else {
    res.status(401).json({ success: false, message: "Identifiants invalides" });
  }
});

// Liste des publications (publique)
app.get("/publications", (req, res) => {
  const data = loadPublications();
  res.json(data);
});

// Ajouter une publication (admin)
app.post('/admin/publications', upload.single('image'), (req, res) => {
  const { titre, contenu, auteur } = req.body;

  if (!titre || !contenu || !auteur ) {
    return res.status(400).json({ message: "Champs manquants ou image non fournie." });
  }

  const imageUrl =  req.file? `/uploads/${req.file.filename}` :null;

  const nouvellePublication = {
    id: Date.now(),
    titre,
    contenu,
    image: imageUrl,
    auteur,
    date: new Date().toISOString()
  };

  const publications = lireJSON(publicationsPath) || [];
  publications.push(nouvellePublication);
  ecrireJSON(publicationsPath, publications);

  res.status(201).json({ message: "Publication ajoutée avec succès." });
});


//message 
app.post('/contact', (req, res) => {
  const { nom, mail, contenu } = req.body;

  if (!nom || !contenu || !mail ) {
    return res.status(400).json({ message: "Champs manquants ou image non fournie." });
  }

  const nouveauMessage = {
    id: Date.now(),
    nom,
    mail,
    contenu,
  };
  
  const messages = lireJSON(messagesPath) || [];
  messages.push(nouveauMessage);
  ecrireJSON(messagesPath, messages);

  res.status(201).json({ message: "Message Publier avec succès." });
});

app.get("/contact", (req, res) => {
  const data = loadMessages();
  res.json(data);
});

app.delete('/admin/messages/:id', (req, res) => {
  let messages = lireJSON(messagesPath);

  const id = req.params.id; 
  const index = messages.findIndex(pub => String(pub.id) === String(id));

  if (!Array.isArray(messages)) messages = [];


  if (index === -1) return res.status(404).json({ message: "Message non trouvé" });

  messages.splice(index, 1);
  ecrireJSON(messagesPath, messages);

  res.json({ message: "Message supprimé" });
});


// Liste des admins
app.get('/admins', (req, res) => {
  const admins = lireAdmins();
  res.json(admins);
});

// suprimer admin
app.delete('/admins/:username', (req, res) => {
  const username = req.params.username;
  let admins = lireAdmins();

  const admin = admins.find(a => a.username === username);

  if (!admin) {
    return res.status(404).json({ message: "Admin introuvable." });
  }

  if (admin.niveau === 1) {
    return res.status(403).json({ message: "Impossible de supprimer l'admin principal." });
  }

  admins = admins.filter(a => a.username !== username);
  ecrireAdmins(admins);
  res.json({ message: "Administrateur supprimé avec succès." });
});

// Supprimer une publication
app.delete('/admin/publications/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let publications = lireJSON(publicationsPath);

  const index = publications.findIndex(pub => pub.id === id);
  if (index === -1) return res.status(404).json({ message: "Publication non trouvée" });

  // Supprimer l'image associée si elle existe
  const imagePath = publications[index].image;
  if (imagePath) {
    const filePath = path.join(__dirname, imagePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  publications.splice(index, 1);
  ecrireJSON(publicationsPath, publications);

  res.json({ message: "Publication supprimée" });
});

// modifier la publication
app.put('/admin/publications/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { titre, contenu, auteur } = req.body;
  const publications = lireJSON(publicationsPath);

  const index = publications.findIndex(p => p.id.toString() === id);
  if (index === -1) return res.status(404).json({ message: "Publication non trouvée" });

  publications[index].titre = titre;
  publications[index].contenu = contenu;
  publications[index].auteur = auteur;
  if (req.file) {
    publications[index].image = `/uploads/${req.file.filename}`;
  }

  ecrireJSON(publicationsPath, publications);
  res.json({ message: "Publication modifiée" });
});

//ajouter un admin
app.post('/admins', (req, res) => {
  const { nom, username, password, niveau } = req.body;
  if (!nom || !username || !password || !niveau) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  const admins = lireJSON(adminsPath);
  if (admins.find(a => a.username === username)) {
    return res.status(409).json({ message: "Nom d’utilisateur déjà utilisé" });
  }

  const newAdmin = { nom, username, password, niveau: parseInt(niveau) };
  admins.push(newAdmin);
  ecrireJSON(adminsPath, admins);
  res.status(201).json(newAdmin);
});

// Récupérer le contenu du site (public)
app.get('/site-content', (req, res) => {
  const content = lireSiteContent();
  if (!content) {
    return res.status(404).json({ message: "Contenu du site non trouvé." });
  }
  res.json(content);
});

app.post('/admin/site-content', upload.array('images'), (req, res) => {
  const data = JSON.parse(req.body.data);
  const {
    nomAssociation,
    pageAccueil,
    pageProjet,
    pageMembre,
    pagePartenaire,
    pageContact,
    poles,
    adminNiveau
  } = data;

  if (adminNiveau !== 1) {
    return res.status(403).json({ message: "Accès interdit" });
  }

  const uploadedImages = req.files || [];
  let imageIndex = 0;

  const injectImages = (array) =>
    (array || []).map(item => {
      const newItem = { ...item };

      // Si l'image existe déjà (string commençant par "/uploads/")
      if (item.image && typeof item.image === 'string' && item.image.startsWith('/uploads/')) {
        return newItem;
      }

      // Si une nouvelle image a été uploadée
      if (imageIndex < uploadedImages.length) {
        newItem.image = `/uploads/${uploadedImages[imageIndex].filename}`;
        imageIndex++;
      } else {
        newItem.image = null;
      }

      return newItem;
    });

  const newContent = {
    nomAssociation,
    pageAccueil: injectImages(pageAccueil),
    pageProjet: injectImages(pageProjet),
    pageMembre: injectImages(pageMembre),
    pagePartenaire: injectImages(pagePartenaire),
    pageContact,
    poles: poles || []
  };

  ecrireSiteContent(newContent);
  res.json({ message: "Contenu du site mis à jour avec succès." });
});





// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});

