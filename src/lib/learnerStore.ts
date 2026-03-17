import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Logger } from './Logger';

export interface Learner {
  id: string;
  name: string;
  band: number;
}

interface LearnerState {
  familyId: string | null;
  familyName: string | null;
  currentTopicId: string | null;
  learners: Learner[];
  activeLearnerId: string | null;
  activeLearnerName: string | null;
  activeLearnerBand: number;
  setActiveLearner: (learnerId: string, band?: number) => void;
  loadFamily: () => Promise<void>;
  isLoaded: boolean;
  isLoading: boolean;
}

export const useLearnerStore = create<LearnerState>()(
  persist(
    (set, get) => ({
      familyId: null,
      familyName: null,
      currentTopicId: null,
      learners: [],
      activeLearnerId: null,
      activeLearnerName: null,
      activeLearnerBand: 0,
      isLoaded: false,
      isLoading: false,

      setActiveLearner: (learnerId: string, band?: number) => {
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
        } else if (band !== undefined) {
           set({
            activeLearnerId: learnerId,
            activeLearnerBand: band,
           });
        } else {
          Logger.warn('[LEARNER_STORE]', `Learner with id ${learnerId} not found`);
          set({
            activeLearnerId: learnerId,
            activeLearnerBand: 0,
          });
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
              currentTopicId: data.family.current_topic_id || null,
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
    }),
    {
      name: 'learner-storage',
      partialize: (state) => ({
        activeLearnerId: state.activeLearnerId,
        activeLearnerBand: state.activeLearnerBand,
        activeLearnerName: state.activeLearnerName
      }),
    }
  )
);

export const useActiveBand = () => useLearnerStore((state) => state.activeLearnerBand);
