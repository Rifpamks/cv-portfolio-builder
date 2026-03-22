interface CvData {
  profile: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    photoURL: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number; // 1-5
    category: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    description: string;
    imageURL: string;
    projectURL: string;
    tags: string[];
  }>;
  blog: Array<{
    id: string;
    title: string;
    content: string;
    excerpt: string;
    publishedAt: string;
    tags: string[];
  }>;
}

export function analyzeCompleteness(data: Partial<CvData>): {
  score: number;
  recommendations: string[];
  sections: Record<string, { filled: boolean; score: number; tip: string }>;
} {
  const sections: Record<string, { filled: boolean; score: number; tip: string }> = {};
  const recommendations: string[] = [];

  // Profile
  const profile = data.profile;
  const profileFields = profile ? [profile.fullName, profile.title, profile.email, profile.phone, profile.location, profile.summary] : [];
  const profileFilled = profileFields.filter(Boolean).length;
  const profileScore = Math.round((profileFilled / 6) * 100);
  sections.profile = { filled: profileScore === 100, score: profileScore, tip: "Complete all personal information fields" };
  if (profileScore < 100) recommendations.push("📝 Complete your profile details — recruiters look for full contact info and a compelling summary.");
  if (profile && !profile.summary) recommendations.push("💡 Add a professional summary — it's the first thing recruiters read!");

  // Education
  const eduCount = data.education?.length || 0;
  sections.education = { filled: eduCount > 0, score: eduCount > 0 ? 100 : 0, tip: "Add at least one education entry" };
  if (eduCount === 0) recommendations.push("🎓 Add your education background — even informal education counts!");

  // Skills
  const skillCount = data.skills?.length || 0;
  const skillScore = Math.min(100, skillCount * 20);
  sections.skills = { filled: skillCount >= 5, score: skillScore, tip: "Add at least 5 skills with proficiency levels" };
  if (skillCount < 5) recommendations.push(`🛠️ Add more skills (${skillCount}/5 minimum) — diverse skills increase interview chances by 40%.`);

  // Experience
  const expCount = data.experience?.length || 0;
  sections.experience = { filled: expCount > 0, score: expCount > 0 ? 100 : 0, tip: "Add your work experience" };
  if (expCount === 0) recommendations.push("💼 Add work experience — include internships, freelance, or volunteer work!");
  if (expCount > 0 && data.experience?.some(e => !e.description)) {
    recommendations.push("✍️ Add descriptions to all experience entries — use action verbs and quantify achievements.");
  }

  // Portfolio
  const portCount = data.portfolio?.length || 0;
  const portScore = Math.min(100, portCount * 33);
  sections.portfolio = { filled: portCount >= 3, score: portScore, tip: "Add at least 3 portfolio items" };
  if (portCount < 3) recommendations.push(`🎨 Add portfolio projects (${portCount}/3 recommended) — show your best work!`);

  // Blog
  const blogCount = data.blog?.length || 0;
  sections.blog = { filled: blogCount > 0, score: blogCount > 0 ? 100 : 0, tip: "Write a blog post to showcase expertise" };
  if (blogCount === 0) recommendations.push("📰 Write a blog post — it showcases thought leadership and communication skills.");

  // Overall
  const totalScore = Math.round(
    (sections.profile.score * 0.25 +
      sections.education.score * 0.15 +
      sections.skills.score * 0.2 +
      sections.experience.score * 0.2 +
      sections.portfolio.score * 0.15 +
      sections.blog.score * 0.05)
  );

  if (totalScore === 100) {
    recommendations.unshift("🎉 Your CV is complete! Consider updating it regularly to stay relevant.");
  } else if (totalScore >= 75) {
    recommendations.unshift("👍 Your CV is looking great! A few more additions will make it outstanding.");
  } else if (totalScore >= 50) {
    recommendations.unshift("📊 Your CV is halfway there. Focus on the sections highlighted below.");
  }

  return { score: totalScore, recommendations, sections };
}
