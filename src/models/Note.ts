import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
	title: string;
	content: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		userId: { type: String, required: true },
	},
	{ timestamps: true }
);

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
