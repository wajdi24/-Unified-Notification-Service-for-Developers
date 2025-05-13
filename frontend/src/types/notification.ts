import { Template } from "./Template"

interface Notification {
  id: string
  title: string
  external_id: string
  projectId: string
  createdAt: string
  updatedAt: string
  template?: Template // optional, if it exists
  category: string
}
export default Notification

