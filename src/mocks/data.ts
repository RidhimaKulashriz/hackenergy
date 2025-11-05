// Mock data for CollabForge demo

import { Event, User, Team, Submission, Judge, Rubric, Score } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Full-stack developer passionate about AI and blockchain",
    skills: ["React", "Node.js", "Python", "ML"],
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "judge",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Senior engineer at TechCorp, hackathon mentor",
    skills: ["JavaScript", "Cloud", "DevOps"],
  },
  {
    id: "user-3",
    name: "Marcus Rodriguez",
    email: "marcus@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    bio: "Event organizer and community builder",
    skills: ["Management", "Strategy", "Design"],
  },
];

export const mockEvents: Event[] = [
  {
    id: "evt-1",
    title: "AI Innovation Summit 2025",
    slug: "ai-innovation-summit-2025",
    description: "Build the future of AI applications. 48 hours to create innovative solutions using cutting-edge machine learning and LLM technologies.",
    tagline: "Shape the Future with AI",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    startAt: new Date("2025-02-15T09:00:00"),
    endAt: new Date("2025-02-17T18:00:00"),
    registrationDeadline: new Date("2025-02-10T23:59:59"),
    tracks: ["Healthcare AI", "Educational Tech", "Climate Solutions"],
    capacity: 200,
    teamSizeMin: 2,
    teamSizeMax: 4,
    tags: ["AI", "Machine Learning", "Innovation"],
    status: "upcoming",
    prizePool: "$50,000",
    isVirtual: false,
    location: "San Francisco, CA",
  },
  {
    id: "evt-2",
    title: "Web3 DeFi Hackathon",
    slug: "web3-defi-hackathon",
    description: "Revolutionize decentralized finance. Build blockchain solutions that make finance accessible to everyone.",
    tagline: "Democratize Finance",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    startAt: new Date("2025-03-01T10:00:00"),
    endAt: new Date("2025-03-03T20:00:00"),
    registrationDeadline: new Date("2025-02-25T23:59:59"),
    tracks: ["DeFi Protocols", "NFT Utilities", "DAO Tools"],
    capacity: 150,
    teamSizeMin: 1,
    teamSizeMax: 5,
    tags: ["Blockchain", "Web3", "DeFi"],
    status: "upcoming",
    prizePool: "$75,000",
    isVirtual: true,
  },
  {
    id: "evt-3",
    title: "Sustainability Tech Challenge",
    slug: "sustainability-tech-challenge",
    description: "Technology for a better planet. Create solutions that address climate change and environmental challenges.",
    tagline: "Code for the Planet",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    startAt: new Date("2025-01-20T09:00:00"),
    endAt: new Date("2025-01-22T17:00:00"),
    registrationDeadline: new Date("2025-01-15T23:59:59"),
    tracks: ["Clean Energy", "Waste Reduction", "Carbon Tracking"],
    capacity: 180,
    teamSizeMin: 2,
    teamSizeMax: 4,
    tags: ["Sustainability", "Environment", "Impact"],
    status: "active",
    prizePool: "$40,000",
    isVirtual: false,
    location: "Seattle, WA",
  },
  {
    id: "evt-4",
    title: "HealthTech Innovation Marathon",
    slug: "healthtech-innovation-marathon",
    description: "Transform healthcare with technology. Build solutions that improve patient care and medical workflows.",
    tagline: "Heal with Code",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    startAt: new Date("2024-12-01T08:00:00"),
    endAt: new Date("2024-12-03T19:00:00"),
    registrationDeadline: new Date("2024-11-25T23:59:59"),
    tracks: ["Telemedicine", "Medical AI", "Health Records"],
    capacity: 120,
    teamSizeMin: 2,
    teamSizeMax: 5,
    tags: ["Healthcare", "Medical", "AI"],
    status: "past",
    prizePool: "$35,000",
    isVirtual: true,
  },
];

export const mockTeams: Team[] = [
  {
    id: "team-1",
    eventId: "evt-3",
    name: "EcoTrackers",
    tagline: "Making carbon footprint visible and actionable",
    members: [
      { userId: "user-1", role: "leader", joinedAt: new Date("2025-01-10") },
    ],
    leaderId: "user-1",
    track: "Carbon Tracking",
    inviteCode: "ECO2025",
    createdAt: new Date("2025-01-10"),
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "sub-1",
    teamId: "team-1",
    eventId: "evt-3",
    title: "CarbonLens - Personal Carbon Tracker",
    description: "An AI-powered mobile app that helps individuals track and reduce their carbon footprint through daily habit monitoring and actionable insights.",
    repoLink: "https://github.com/example/carbonlens",
    demoLink: "https://carbonlens-demo.com",
    files: [],
    submittedAt: new Date("2025-01-22T16:30:00"),
    accessibilityScore: 95,
  },
];

export const mockJudges: Judge[] = [
  {
    id: "judge-1",
    userId: "user-2",
    eventId: "evt-3",
    expertiseTags: ["Sustainability", "Mobile Apps", "AI"],
    assignedSubmissions: ["sub-1"],
  },
];

export const mockRubrics: Rubric[] = [
  {
    id: "rubric-1",
    eventId: "evt-3",
    name: "Sustainability Impact Rubric",
    criteria: [
      {
        id: "crit-1",
        name: "Innovation",
        description: "Originality and creativity of the solution",
        weight: 25,
        maxScore: 10,
      },
      {
        id: "crit-2",
        name: "Impact",
        description: "Potential environmental and social impact",
        weight: 30,
        maxScore: 10,
      },
      {
        id: "crit-3",
        name: "Technical Excellence",
        description: "Code quality, architecture, and implementation",
        weight: 25,
        maxScore: 10,
      },
      {
        id: "crit-4",
        name: "Presentation",
        description: "Demo quality and communication",
        weight: 20,
        maxScore: 10,
      },
    ],
  },
];

export const mockScores: Score[] = [];

// Helper to get current user (mock auth)
export const getCurrentUser = (): User => {
  return mockUsers[0]; // Default to participant for demo
};

// Helper to switch roles (demo only)
export const setCurrentUserRole = (role: "admin" | "participant" | "judge") => {
  const user = mockUsers.find((u) => u.role === role);
  return user || mockUsers[0];
};
