// src/models/CertificateTemplate.model.ts
import mongoose, { Schema, Document } from 'mongoose';
export interface ICertificateTemplate extends Document {
    program: string;
    templateUrl: string; // URL of the blank template on Cloudinary
}
const TemplateSchema = new Schema({
    program: { type: String, required: true, unique: true },
    templateUrl: { type: String, required: true }
});
export default mongoose.model<ICertificateTemplate>('CertificateTemplate', TemplateSchema);