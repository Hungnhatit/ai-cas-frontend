import { api } from '@/lib/axios';

// Submit test answers and get results
export const competencyService = {
  getCompetencies: async () => {
    const res = await api.get('/competency');
    return res.data;
  },

  getCompetencyById: async (competency_id: number) => {
    const res = await api.get(`/competency/${competency_id}`);
    return res.data;
  },

  getCriterias: async () => {
    const res = await api.get(`/competency/criterias`);
    return res.data;
  }
}

