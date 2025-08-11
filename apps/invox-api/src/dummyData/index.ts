import { Types } from "mongoose";
import { ProjectModel } from "../models/project-model";

/**
 * Generates and inserts dummy project documents using ProjectModel.
 * @param {number} count - The number of dummy projects to generate.
 * @returns {Promise<Array<Object>>} Array of created dummy project documents.
 */

export async function generateAndInsertDummyProjects(
  count: number = 20,
  userId: string
) {
  // const anonUserId = new Types.ObjectId("ae7fdd91-65d5-4a46-a461-69455db86893");
  const anonUserId = new Types.ObjectId(userId);
  const now = Date.now();
  const projects = [];
  for (let i = 0; i < count; i++) {
    // Add a little difference in seconds for each document
    const createdAt = new Date(now + i * 1000 * 60); // each project 1 minute apart
    const updatedAt = new Date(createdAt.getTime() + 1000 * (30 + i * 10)); // updatedAt is 30s + 10s*i after createdAt
    projects.push({
      name: `Demo Project ${i + 1}`,
      createdAt,
      updatedAt,
      anonUser: anonUserId,
      selectedTemplate: `template-${i + 1}`,
      isDeleted: false,
      isActive: true,
    });
  }
  // Insert documents using ProjectModel
  return await ProjectModel.insertMany(projects);
}
