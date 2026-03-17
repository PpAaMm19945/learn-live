import { create } from 'zustand';
import { Logger } from './Logger';

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
  familyId: string | null;
  familyName: string | null;
  learners: Array<{ id: string; name: string; band: number }>;
  activeLearnerId: string | null;
  activeLearnerName: string | null;
  activeLearnerBand: number;
  setActiveLearner: (learnerId: string) => void;
  loadFamily: () => Promise<void>;
  isLoaded: boolean;
  isLoading: boolean;
}

export const useLearnerStore = create<LearnerState>((set, get) => ({
  familyId: null,
  familyName: null,
  learners: [],
  activeLearnerId: null,
  activeLearnerName: null,
  activeLearnerBand: 0,
  isLoaded: false,
  isLoading: false,

  setActiveLearner: (learnerId: string) => {
    const { learners } = get();
    const learner = learners.find((l) => l.id === learnerId);

    if (learner) {
      localStorage.setItem('learn-live-learner-id', learnerId);
      Logger.info('[LEARNER_STORE]', `Active learner set to ${learner.name} (Band ${learner.band})`);
      set({
        activeLearnerId: learner.id,
        activeLearnerName: learner.name,
        activeLearnerBand: learner.band,
      });
    } else {
      Logger.warn('[LEARNER_STORE]', `Learner with id ${learnerId} not found`);
    }
  },

  loadFamily: async () => {
    const state = get();
    if (state.isLoading) return;
    set({ isLoading: true });

    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/family`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch family data');
      }

      const data = await res.json();

      if (data && data.family && data.learners) {
        set({
          familyId: data.family.id,
          familyName: data.family.name,
          learners: data.learners,
          isLoaded: true,
        });

        const { activeLearnerId, setActiveLearner } = get();

        // Auto-select learner logic
        if (!activeLearnerId && data.learners.length > 0) {
          const savedLearnerId = localStorage.getItem('learn-live-learner-id');
          const savedLearnerExists = data.learners.some((l: Learner) => l.id === savedLearnerId);

          if (savedLearnerId && savedLearnerExists) {
            setActiveLearner(savedLearnerId);
          } else {
            setActiveLearner(data.learners[0].id);
          }
        } else if (activeLearnerId) {
          // If we already have an active learner but want to re-sync details
          setActiveLearner(activeLearnerId);
        }
      }
    } catch (error) {
      Logger.error('[LEARNER_STORE]', 'Error loading family data', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useActiveBand = () => useLearnerStore((state) => state.activeLearnerBand);
