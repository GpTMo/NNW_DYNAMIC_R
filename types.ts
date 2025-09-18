import React from 'react';

export interface Service {
  title: string;
  description: string;
}

export interface Wig {
  id: number;
  name: string;
  imageUrl: string;
  overlayUrl: string;
  description: string;
  videoUrl?: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export interface CareTip {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export interface RepairExample {
  id: number;
  beforeUrl: string;
  afterUrl: string;
  title: string;
}

export interface FaceTrackingData {
    x: number;
    y: number;
    scale: number;
    angle: number;
}