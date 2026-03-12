export interface ExaminerQuestion {
    id: string;
    text: string;
    expected_concept: string;
    asked_at: string;
    answered: boolean;
}

export interface AssessmentDraft {
    status: 'success' | 'needs_revision' | 'inconclusive';
    summary: string;
    observations: string;
    confidence: number;
}

export interface ExamSession {
    id: string;
    lesson_id: string;
    user_id: string;
    band: number;
    started_at: string;
    status: 'active' | 'completed' | 'abandoned';
    questions: ExaminerQuestion[];
    assessment?: AssessmentDraft;
}
