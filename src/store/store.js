import create from 'zustand'

export const useStore = create(set => ({
  feedback: null,
  setFeedback: (feedback) => set(() => ({ feedback })),
}))