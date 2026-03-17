import { create } from 'zustand';

interface Learner {
  id: string;
  name: string;
  band: number;
}

interface LearnerState {
  selectedLearner: Learner | null;
  learners: Learner[];
  setSelectedLearner: (learner: Learner | null) => void;
  setLearners: (learners: Learner[]) => void;
}

export const useLearnerStore = create<LearnerState>((set) => ({
  selectedLearner: null,
  learners: [],
  setSelectedLearner: (learner) => set({ selectedLearner: learner }),
  setLearners: (learners) => set({ learners }),
}));
