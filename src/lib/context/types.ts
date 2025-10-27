/**
 * Types for Smart Context Auto-Population
 * Enables seamless data sharing between Career Hub and external tools
 */

export interface ToolContext {
  // Metadata
  source: 'career-hub'
  version: '1.0'
  timestamp: number

  // User identity
  userId: string // WordPress user ID

  // Application reference
  applicationId: string

  // Display data (for banners/titles)
  companyName: string
  positionTitle: string

  // Security
  token: string // JWT token for API access
  expiresAt: number

  // API endpoint
  careerHubUrl: string
}

export interface ApplicationContextData {
  // Basic info
  id: string
  company_name: string
  position_title: string
  status: string
  date_applied: string

  // Job details
  job_url?: string
  job_description?: string
  location?: string
  salary_range?: string
  remote_type?: string

  // User data
  notes?: string
  source?: string

  // Related data
  documents?: ContextDocument[]
  activities?: ContextActivity[]
}

export interface ContextDocument {
  id: string
  title: string
  document_type: 'resume' | 'cover_letter' | 'other'
  file_url?: string
  created_at: string
}

export interface ContextActivity {
  id: string
  activity_type: string
  activity_date: string
  notes?: string
}

export type ToolType =
  | 'interview-coach'
  | 'resume-analyzer'
  | 'cover-letter'
  | 'oracle-pro'
  | 'hidden-boards'
  | 'interview-guide'

export interface PostMessageEvent {
  type: PostMessageType
  data?: any
  requestId?: string
}

export type PostMessageType =
  | 'CONTEXT_READY'
  | 'REQUEST_FULL_DATA'
  | 'REQUEST_DOCUMENTS'
  | 'SAVE_NOTES'
  | 'SAVE_ACTIVITY'
  | 'UPDATE_STATUS'
  | 'TOOL_LOADED'
