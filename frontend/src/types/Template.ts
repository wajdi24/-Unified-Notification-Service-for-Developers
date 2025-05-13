export type TemplateType = "EMAIL" | "SMS";

export interface Template {
  id: string;
  title: string;
  subject: string;
  body: string;
  type: TemplateType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
