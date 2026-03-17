import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LearnerState {
    activeLearnerId: string | null;
    activeBand: number;
    setActiveLearner: (id: string | null, band: number) => void;
}

export const useLearnerStore = create<LearnerState>()(
    persist(
        (set) => ({
            activeLearnerId: null,
            activeBand: 0,
            setActiveLearner: (id, band) => set({ activeLearnerId: id, activeBand: band }),
        }),
        {
            name: 'learner-storage',
        }
    )
);

export const useActiveBand = () => useLearnerStore((state) => state.activeBand);
