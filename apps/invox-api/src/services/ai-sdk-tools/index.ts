import { z } from "zod";
import { generateObject, tool } from "ai";
import { ArtifactModel } from "../../models/artifacts-model";
import env from "~/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { templateModificationSystemPrompt } from "~/config/prompts";
import { ArtifactService, DUMMY_INVOICE_DATA } from "../artifact-service";
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
        "Update the HTML per the change request or fix the issue, then provide a summary of the modifications.",
      inputSchema: z.object({
        change_request: z
          .string()
          .describe("String describing the modification request or issue"),
      }),
      async execute({ change_request }) {
        // const startTime = Date.now();
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
          model: openrouter.chat("google/gemini-2.5-flash"),
          prompt: `
          <user_request>
            ${change_request}
          </user_request>

          <html_template>
            ${artifact.content}
          </html_template>

          <dummy_data_used_to_populate_template>
          ${JSON.stringify(DUMMY_INVOICE_DATA, null, 2)}
          </dummy_data_used_to_populate_template>
          `,
          schema: z.object({
            summary: z.string().describe("Summary of modifications done"),
            html: z.string().describe("Updated HTML"),
          }),
          system: templateModificationSystemPrompt,
          maxOutputTokens: 25000,
          maxRetries: 2,
          providerOptions: {
            openrouter: {
              reasoning: {
                max_tokens: 128,
              },
            },
          },
        });

        localState.set(
          "updatedHtml",
          ArtifactService.sanitizeHTML(object.html)
        );

        localState.set("toolUsage", usage);

        // const endTime = Date.now();
        // const durationMs = endTime - startTime;
        // console.log(`AI TOOL took ${durationMs}ms`);
        return {
          summary: object.summary,
          html: object.html,
        };
      },
    });
  };
}
