export interface BookItem {
  id: string
  title: string
  author: string
  link: string
  coverUrl?: string
}

export interface InstagramPage {
  id: string
  name: string
  handle: string
  link: string
  imageUrl?: string
}

export interface Reminder {
  id: string
  title: string
  content: string
  date?: string
}

export const tipsService = {
  async getRecommendedBooks(): Promise<BookItem[]> {
    try {
      // Aqui você faria chamadas reais para o Supabase
      // Por enquanto, vamos retornar dados mockados

      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          title: "Comunicação Alternativa",
          author: "Maria Silva",
          link: "https://example.com/book1",
          coverUrl: "https://example.com/covers/book1.jpg",
        },
        {
          id: "2",
          title: "Autismo e Educação",
          author: "João Santos",
          link: "https://example.com/book2",
          coverUrl: "https://example.com/covers/book2.jpg",
        },
        {
          id: "3",
          title: "Desenvolvimento Infantil",
          author: "Ana Oliveira",
          link: "https://example.com/book3",
          coverUrl: "https://example.com/covers/book3.jpg",
        },
        {
          id: "4",
          title: "Inclusão na Prática",
          author: "Carlos Mendes",
          link: "https://example.com/book4",
          coverUrl: "https://example.com/covers/book4.jpg",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar livros recomendados:", error)
      throw error
    }
  },

  async getInstagramPages(): Promise<InstagramPage[]> {
    try {
      // Aqui você faria chamadas reais para o Supabase
      // Por enquanto, vamos retornar dados mockados

      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          name: "Autismo em Foco",
          handle: "@autismoemfoco",
          link: "https://instagram.com/autismoemfoco",
          imageUrl: "https://example.com/instagram/autismoemfoco.jpg",
        },
        {
          id: "2",
          name: "Comunicação Inclusiva",
          handle: "@comunicacaoinclusiva",
          link: "https://instagram.com/comunicacaoinclusiva",
          imageUrl: "https://example.com/instagram/comunicacaoinclusiva.jpg",
        },
        {
          id: "3",
          name: "Desenvolvimento Atípico",
          handle: "@desenvolvimentoatipico",
          link: "https://instagram.com/desenvolvimentoatipico",
          imageUrl: "https://example.com/instagram/desenvolvimentoatipico.jpg",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar páginas do Instagram:", error)
      throw error
    }
  },

  async getReminders(): Promise<Reminder[]> {
    try {
      // Aqui você faria chamadas reais para o Supabase
      // Por enquanto, vamos retornar dados mockados

      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          title: "Lembrete",
          content: "Mantenha a consistência no uso do aplicativo para melhores resultados.",
          date: "2023-05-15",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar lembretes:", error)
      throw error
    }
  },
}
