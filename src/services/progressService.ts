export interface ProgressMetric {
  id: string
  title: string
  value: string | number
  progress: number
  icon: string
  color: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  earned: boolean
  date?: string
}

export const progressService = {
  async getProgressMetrics(profileId: string): Promise<ProgressMetric[]> {
    try {
      // Aqui você faria chamadas reais para o Supabase
      // Por enquanto, vamos retornar dados mockados

      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "interactions",
          title: "Interações totais",
          value: 247,
          progress: 0.7,
          icon: "activity",
          color: "#FF9F43",
        },
        {
          id: "active_days",
          title: "Dias ativos no app",
          value: 14,
          progress: 0.5,
          icon: "calendar",
          color: "#5A67F2",
        },
        {
          id: "avg_time",
          title: "Tempo médio por sessão",
          value: "12 min",
          progress: 0.6,
          icon: "clock",
          color: "#FF9F43",
        },
        {
          id: "most_used",
          title: "Categoria mais usada",
          value: "Comidas",
          progress: 0.8,
          icon: "pie-chart",
          color: "#5A67F2",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar métricas de progresso:", error)
      throw error
    }
  },

  async getAchievements(profileId: string): Promise<Achievement[]> {
    try {
      // Aqui você faria chamadas reais para o Supabase
      // Por enquanto, vamos retornar dados mockados

      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          name: "Primeira Interação",
          description: "Completou sua primeira interação no aplicativo",
          icon: "award",
          points: 10,
          earned: true,
          date: "10/05/2023",
        },
        {
          id: "2",
          name: "Explorador",
          description: "Visitou todas as categorias de imagens",
          icon: "compass",
          points: 20,
          earned: true,
          date: "15/05/2023",
        },
        {
          id: "3",
          name: "Comunicador",
          description: "Usou 10 imagens diferentes para comunicação",
          icon: "message-circle",
          points: 30,
          earned: true,
          date: "20/05/2023",
        },
        {
          id: "4",
          name: "Consistente",
          description: "Usou o aplicativo por 7 dias consecutivos",
          icon: "calendar",
          points: 40,
          earned: false,
        },
        {
          id: "5",
          name: "Mestre da Comunicação",
          description: "Usou 50 imagens diferentes para comunicação",
          icon: "star",
          points: 50,
          earned: false,
        },
        {
          id: "6",
          name: "Super Tutor",
          description: "Adicionou 5 imagens personalizadas",
          icon: "upload",
          points: 30,
          earned: false,
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar conquistas:", error)
      throw error
    }
  },

  async getChildAchievements(childId: string): Promise<Achievement[]> {
    try {
      // Aqui você faria chamadas reais para o Supabase para buscar as conquistas específicas da criança
      // Por enquanto, vamos retornar dados mockados

      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Retornar as mesmas conquistas para qualquer criança por enquanto
      return this.getAchievements("any")
    } catch (error) {
      console.error("Erro ao buscar conquistas da criança:", error)
      throw error
    }
  },
}
