import { z } from "zod";
import { generateObject, tool } from "ai";
import { ArtifactModel } from "../../models/artifacts-model";
import env from "~/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { templateModificationSystemPrompt } from "~/config/prompts";
import { ArtifactService } from "../artifact-service";
import { AIToolLocalState } from "~/types";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export class AiSdkTools {
  static modification_request = (
    artifactId: string,
    localState: AIToolLocalState
  ) => {
    return tool({
      description:
        "Modify HTML based on the provided change request and return a summary of modifications.",
      inputSchema: z.object({
        change_request: z
          .string()
          .describe("String describing the modification request"),
      }),
      async execute({ change_request }) {
        const artifact = await ArtifactModel.findOne({
          _id: artifactId,
          isDeleted: false,
        }).lean();

        if (!artifact) {
          return {
            summary: "Not able to locate the template.",
          };
        }

        const { object, usage } = await generateObject({
          model: openrouter.chat("openai/gpt-5-nano"),
          prompt: `
          <user_request>
            ${change_request}
          </user_request>

          <html_template>
            ${artifact.content}
          </html_template>
          `,
          schema: z.object({
            summary: z.string().describe("Summary of modifications done"),
            html: z.string().describe("Updated HTML"),
          }),
          system: templateModificationSystemPrompt,
          maxOutputTokens: 5000,
          maxRetries: 2,
        });

        localState.set(
          "updatedHtml",
          ArtifactService.sanitizeHTML(object.html)
        );

        localState.set("toolUsage", usage);

        return {
          summary: object.summary,
        };
      },
    });
  };
}
