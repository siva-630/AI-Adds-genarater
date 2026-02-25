
import React from 'react';
export interface UploadZoneProps {
    label: String;
    file: File | null;
    onClear: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export interface User {
    id?: string;
    name?: string;
    email?: string;
}   

export interface Project {
    id: string;
    name?: string;
    userId?: string;
    user?: User;
    productName: string;
    productDescription?: string;
    userPrompt?: string;
    aspectRatio: string;
    targetLength?: number;
    generatedImage?: string;
    generatedVideo?: string;
    isGenerating: boolean;
    // dummy data uses boolean for published state; accept boolean as well as Date/string
    isPublished: boolean | Date | string;
    error?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    uploadedImages: string[];

}