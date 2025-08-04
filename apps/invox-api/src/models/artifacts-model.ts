import { Schema, model, Types } from "mongoose";

export interface Artifact {
  type: "html";
  name: string;
  content: string;
  metadata: {
    createdBy: Types.ObjectId; // Reference to AnonUser
  };
  version: number;
  projectId: Types.ObjectId;
  templateId: Types.ObjectId;
  baseArtifactId: `${string}-${string}`;
  parentId: Types.ObjectId; // Reference to parent artifact, required
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArtifactSchema = new Schema<Artifact>(
  {
    type: {
      type: String,
      enum: ["html"],
      required: true,
      default: "html",
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "AnonUser",
        required: true,
      },
    },
    version: {
      type: Number,
      required: true,
      default: 0,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    baseArtifactId: {
      type: String,
      required: true,
      unique: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Artifact",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "artifacts",
    timestamps: true,
  }
);

ArtifactSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.projectId && this.templateId) {
      this.baseArtifactId = `${this.projectId.toString()}-${this.templateId.toString()}`;
    } else {
      return next(
        new Error("projectId and templateId are required to generate uniqueId")
      );
    }

    const latest = await ArtifactModel.findOne({
      baseArtifactId: this.baseArtifactId,
    })
      .sort({ version: -1 })
      .lean();

    if (latest && typeof latest.version === "number") {
      this.version = latest.version + 1;
    }
  }
  next();
});

export const ArtifactModel = model<Artifact>("Artifact", ArtifactSchema);
