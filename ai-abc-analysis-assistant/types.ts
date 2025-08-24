
export interface AIFeedback {
  provider: 'gemini';
  suggestions: string;
  timestamp: Date;
}

export interface ABCAnalysis {
  id: string;
  studentId: string;
  date: Date;
  antecedent: string;
  behavior: string;
  consequence: string;
  desiredBehavior: string;
  praiseMethod: string;
  enjoyableActivity: string;
  responseStrategy: string;
  aiFeedback?: AIFeedback;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  createdAt: Date;
  analyses: ABCAnalysis[];
}

export type ABCAnalysisData = Omit<ABCAnalysis, 'id' | 'studentId' | 'date' | 'aiFeedback'>;
