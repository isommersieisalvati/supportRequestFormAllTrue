export interface RequestForm {
  fullName: string;
  email: string;
  issueType: string;
  tags: string[];
  reproduceSteps: { value: string }[];
}