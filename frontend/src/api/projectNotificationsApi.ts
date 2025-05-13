import axiosInstance from "./axios";

import { Template } from "@/types/Template";
import Project from "@/types/Project";

export const fetchProjectsWithNotifications = async (projectId: string) => {
    try {
        const { data } = await axiosInstance.get<Project[]>(`/notifications/project/${projectId}`);
        return data;
    } catch (error) {
        console.error("Error fetching projects with notifications:", error);
        throw error;
    }
}

export const createTemplateForNotification = async ({
    notificationId,
    template,
}: {
    notificationId: string
    template: Omit<Template, "id" | "userId" | "createdAt" | "updatedAt">
}) => {
    const { data } = await axiosInstance.post(`/notifications/${notificationId}/template`, template)
    return data
}
