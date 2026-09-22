import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.ts';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ammar_nazir_portfolio_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ammar.dev';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const ALLOWED_ADMIN_EMAILS = [
  (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
  'admin@ammar.dev',
  'muhammad.bsit594@iiu.edu.pk'
].filter(Boolean);

// Helper to check admin password
async function verifyAdminPassword(password: string): Promise<boolean> {
  const allowedPasswords = [
    DEFAULT_ADMIN_PASSWORD,
    'Admin@12345'
  ];

  if (allowedPasswords.includes(password)) return true;
  try {
    for (const allowed of allowedPasswords) {
      if (await bcrypt.compare(password, allowed)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid token', error: (err as Error).message });
  }
}

// -------------------------------------------------------------
// PUBLIC PORTFOLIO ENDPOINTS
// -------------------------------------------------------------

// Comprehensive portfolio bundle for instant 1-roundtrip initial loading
router.get('/portfolio', (req, res) => {
  db.recordVisit(req.ip);
  const profile = db.getProfile();
  const projects = db.getProjects();
  const skills = db.getSkills(true);
  const experiences = db.getExperiences();
  const posts = db.getPosts(true);

  res.json({
    profile,
    projects,
    skills,
    experiences,
    posts,
    whatsappNumber: profile.whatsappNumber || process.env.WHATSAPP_NUMBER || '923001234567'
  });
});

router.get('/projects', (req, res) => {
  const { category, featured } = req.query;
  let projects = db.getProjects();
  if (category && category !== 'all') {
    projects = projects.filter(p => p.category === category);
  }
  if (featured === 'true') {
    projects = projects.filter(p => p.featured);
  }
  res.json(projects);
});

router.get('/skills', (req, res) => {
  res.json(db.getSkills(true));
});

router.get('/experiences', (req, res) => {
  res.json(db.getExperiences());
});

router.get('/blogs', (req, res) => {
  res.json(db.getPosts(true));
});

router.get('/blogs/:slug', (req, res) => {
  const post = db.getPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  res.json(post);
});

// Contact Form - creates structured message and WhatsApp direct link
router.post('/contact', (req, res) => {
  const { name, email, phone, subject, budget, timeline, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Name, email, phone number, and message are required.' });
  }

  const profile = db.getProfile();
  const targetWhatsApp = profile.whatsappNumber || process.env.WHATSAPP_NUMBER || '923001234567';

  // Format clean structured WhatsApp message text
  const structuredText = [
    `*New Portfolio Inquiry* 📬`,
    `Hello Ammar! I am reaching out to you from your portfolio website.`,
    ``,
    `*Sender Details:*`,
    `• *Name:* ${name.trim()}`,
    `• *Email:* ${email.trim()}`,
    phone ? `• *Phone/WhatsApp:* ${phone.trim()}` : null,
    ``,
    `*Project Details:*`,
    `• *Subject / Topic:* ${subject ? subject.trim() : 'General Inquiry'}`,
    budget ? `• *Estimated Budget:* ${budget.trim()}` : null,
    timeline ? `• *Expected Timeline:* ${timeline.trim()}` : null,
    ``,
    `*Message:*`,
    `"${message.trim()}"`,
    ``,
    `Looking forward to discussing further!`
  ].filter(Boolean).join('\n');

  // Persist to admin inbox
  const savedMessage = db.addMessage({
    name,
    email,
    phone,
    subject: subject || 'General Inquiry',
    budget,
    timeline,
    message,
    formattedWhatsAppText: structuredText
  });

  // Clean WhatsApp phone number format
  const sanitizedPhone = targetWhatsApp.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(structuredText);
  const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${encodedText}`;

  res.json({
    success: true,
    message: 'Message registered successfully.',
    whatsappUrl,
    formattedWhatsAppText: structuredText,
    inboxRecordId: savedMessage.id
  });
});

// -------------------------------------------------------------
// AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const inputEmail = email.toLowerCase().trim();
  const isValidEmail = ALLOWED_ADMIN_EMAILS.includes(inputEmail);
  const isPasswordMatch = await verifyAdminPassword(password);

  if (!isValidEmail || !isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { email: inputEmail, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      email: inputEmail,
      name: 'Muhammad Ammar Nazir',
      role: 'admin'
    }
  });
});

router.get('/auth/verify', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// -------------------------------------------------------------
// SECURE ADMIN MANAGEMENT ENDPOINTS
// -------------------------------------------------------------

// Admin Overview
router.get('/admin/overview', requireAuth, (req, res) => {
  const projects = db.getProjects();
  const posts = db.getPosts(false);
  const skills = db.getSkills();
  const messages = db.getMessages();
  const unreadMessages = messages.filter(m => !m.read).length;

  res.json({
    stats: {
      totalProjects: projects.length,
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.isPublished).length,
      totalSkills: skills.length,
      totalMessages: messages.length,
      unreadMessages
    },
    analytics: db.getVisitorAnalytics(14),
    recentMessages: messages.slice(0, 5)
  });
});

// Admin Visitors Analytics Endpoint
router.get('/admin/visitors', requireAuth, (req, res) => {
  const days = Number(req.query.days) || 14;
  res.json(db.getVisitorAnalytics(days));
});

// Admin Categories Management (Projects, Blogs, Skills)
router.get('/admin/categories', requireAuth, (req, res) => {
  const profile = db.getProfile();
  res.json({
    projectCategories: profile.projectCategories || [],
    blogCategories: profile.blogCategories || [],
    skillCategories: profile.skillCategories || []
  });
});

router.put('/admin/categories', requireAuth, (req, res) => {
  const { projectCategories, blogCategories, skillCategories } = req.body;
  const updates: Record<string, unknown> = {};
  if (Array.isArray(projectCategories)) updates.projectCategories = projectCategories;
  if (Array.isArray(blogCategories)) updates.blogCategories = blogCategories;
  if (Array.isArray(skillCategories)) updates.skillCategories = skillCategories;

  const updatedProfile = db.updateProfile(updates);
  res.json({
    success: true,
    projectCategories: updatedProfile.projectCategories,
    blogCategories: updatedProfile.blogCategories,
    skillCategories: updatedProfile.skillCategories
  });
});

// Admin Blog CRUD
router.get('/admin/blogs', requireAuth, (req, res) => {
  res.json(db.getPosts(false));
});

router.post('/admin/blogs', requireAuth, (req, res) => {
  const { title, slug, excerpt, content, coverImage, images, tags, readTimeMinutes, isPublished } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const generatedSlug = slug
    ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const post = db.createPost({
    title,
    slug: generatedSlug,
    excerpt: excerpt || title,
    content,
    coverImage: coverImage || '',
    images: Array.isArray(images) ? images : [],
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : ['Tech']),
    readTimeMinutes: Number(readTimeMinutes) || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true
  });

  res.status(201).json(post);
});

router.put('/admin/blogs/:id', requireAuth, (req, res) => {
  const updated = db.updatePost(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  res.json(updated);
});

router.delete('/admin/blogs/:id', requireAuth, (req, res) => {
  const deleted = db.deletePost(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  res.json({ success: true, message: 'Blog post deleted' });
});

// Admin Project CRUD
router.post('/admin/projects', requireAuth, (req, res) => {
  const { title, slug, description, fullDescription, category, tags, coverImage, images, liveUrl, githubUrl, driveUrl, featured, order } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const generatedSlug = slug
    ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const project = db.createProject({
    title,
    slug: generatedSlug,
    description,
    fullDescription,
    category: category || 'fullstack',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
    coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    images: Array.isArray(images) ? images : [],
    liveUrl,
    githubUrl,
    driveUrl,
    featured: Boolean(featured),
    order: Number(order) || (db.getProjects().length + 1)
  });

  res.status(201).json(project);
});

router.put('/admin/projects/:id', requireAuth, (req, res) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(updated);
});

router.delete('/admin/projects/:id', requireAuth, (req, res) => {
  const deleted = db.deleteProject(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json({ success: true, message: 'Project deleted' });
});

// Admin Skills CRUD
router.get('/admin/skills', requireAuth, (req, res) => {
  res.json(db.getSkills(false));
});

router.post('/admin/skills', requireAuth, (req, res) => {
  const { name, category, proficiency, iconName, description, order, isPublished } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Skill name is required' });
  }
  const skill = db.createSkill({
    name,
    category: category || 'frontend',
    proficiency: Number(proficiency) || 80,
    iconName: iconName || 'Code',
    description: description || '',
    order: Number(order) || (db.getSkills().length + 1),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true
  });
  res.status(201).json(skill);
});

router.put('/admin/skills/:id', requireAuth, (req, res) => {
  const updated = db.updateSkill(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Skill not found' });
  }
  res.json(updated);
});

router.patch('/admin/skills/:id/publish', requireAuth, (req, res) => {
  const { isPublished } = req.body;
  const updated = db.updateSkill(req.params.id, { isPublished: Boolean(isPublished) });
  if (!updated) {
    return res.status(404).json({ message: 'Skill not found' });
  }
  res.json(updated);
});

router.delete('/admin/skills/:id', requireAuth, (req, res) => {
  const deleted = db.deleteSkill(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Skill not found' });
  }
  res.json({ success: true, message: 'Skill deleted' });
});

// Admin Experience CRUD
router.post('/admin/experiences', requireAuth, (req, res) => {
  const { role, company, companyUrl, location, period, current, description, technologies, order } = req.body;
  if (!role || !company) {
    return res.status(400).json({ message: 'Role and company are required' });
  }
  const exp = db.createExperience({
    role,
    company,
    companyUrl,
    location: location || 'Islamabad, Pakistan',
    period: period || 'Present',
    current: Boolean(current),
    description: Array.isArray(description) ? description : [description || ''],
    technologies: Array.isArray(technologies) ? technologies : [],
    order: Number(order) || (db.getExperiences().length + 1)
  });
  res.status(201).json(exp);
});

router.put('/admin/experiences/:id', requireAuth, (req, res) => {
  const updated = db.updateExperience(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  res.json(updated);
});

router.delete('/admin/experiences/:id', requireAuth, (req, res) => {
  const deleted = db.deleteExperience(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  res.json({ success: true, message: 'Experience deleted' });
});

// Admin Profile / Dynamic Settings
router.put('/admin/settings', requireAuth, (req, res) => {
  const updated = db.updateProfile(req.body);
  res.json(updated);
});

// Admin Inbox Messages
router.get('/admin/messages', requireAuth, (req, res) => {
  res.json(db.getMessages());
});

router.patch('/admin/messages/:id/read', requireAuth, (req, res) => {
  const success = db.markMessageRead(req.params.id, req.body.read !== undefined ? Boolean(req.body.read) : true);
  if (!success) {
    return res.status(404).json({ message: 'Message not found' });
  }
  res.json({ success: true });
});

router.delete('/admin/messages/:id', requireAuth, (req, res) => {
  const deleted = db.deleteMessage(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Message not found' });
  }
  res.json({ success: true, message: 'Message deleted' });
});

export default router;
