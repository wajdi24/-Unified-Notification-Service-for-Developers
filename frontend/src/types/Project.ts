import Notification from "./notification";
interface ConfigEmail {
  mail_host: string;
  mail_port: string;
  email_user: string;
  email_pass: string;
}

interface Project {
  id: number;
  name_project: string;
  notifications: Notification[];
  user_id: number;
  config_email: ConfigEmail;
  api_key: string;
  createdAt: string;
  updatedAt: string;
}

export default Project