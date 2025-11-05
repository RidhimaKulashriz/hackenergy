// Core type definitions for CollabForge

export type UserRole = "admin" | "participant" | "judge";

export type EventStatus = "upcoming" | "active" | "past";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  tagline: string;
  coverImage?: string;
  startAt: Date;
  endAt: Date;
  registrationDeadline: Date;
  tracks: string[];
  capacity: number;
  teamSizeMin: number;
  teamSizeMax: number;
  tags: string[];
  status: EventStatus;
  prizePool?: string;
  location?: string;
  isVirtual: boolean;
  rules?: string;
  schedule?: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  time: Date;
  title: string;
  description?: string;
  type: "keynote" | "workshop" | "deadline" | "break" | "ceremony";
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  tagline?: string;
  members: TeamMember[];
  leaderId: string;
  track?: string;
  repoLink?: string;
  readmePreview?: string;
  inviteCode?: string;
  createdAt: Date;
}

export interface TeamMember {
  userId: string;
  role: "leader" | "member";
  joinedAt: Date;
}

export interface Submission {
  id: string;
  teamId: string;
  eventId: string;
  title: string;
  description: string;
  repoLink?: string;
  demoLink?: string;
  videoLink?: string;
  files: SubmissionFile[];
  submittedAt: Date;
  accessibilityScore?: number;
}

export interface SubmissionFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Judge {
  id: string;
  userId: string;
  eventId: string;
  expertiseTags: string[];
  assignedSubmissions: string[];
}

export interface Rubric {
  id: string;
  eventId: string;
  name: string;
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  weight: number;
  maxScore: number;
}

export interface Score {
  id: string;
  submissionId: string;
  judgeId: string;
  rubricId: string;
  breakdown: ScoreBreakdown[];
  totalScore: number;
  feedback?: string;
  createdAt: Date;
}

export interface ScoreBreakdown {
  criterionId: string;
  score: number;
  comment?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
