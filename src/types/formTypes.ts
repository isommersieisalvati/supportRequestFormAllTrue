export interface SupportForm {
  fullName: string;
  email: string;
  issueType: string;
  tags: string[];
  reproduceSteps: { step: string }[];
}
