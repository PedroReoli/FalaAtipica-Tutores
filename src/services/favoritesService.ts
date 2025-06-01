import { supabase } from "./supabase"

export interface FavoriteItem {
  id: string
  type: "game" | "category" | "image" | "article" | "book"
  title: string
  description?: string
  thumbnail_url?: string | null
  created_at: string
}

export const favoritesService = {
  async getFavorites(profileId: string): Promise<FavoriteItem[]> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          item_id,
          item_type,
          created_at,
          games:item_id (
            id,
            name,
            description,
            thumbnail_url
          ),
          categories:item_id (
            id,
            name,
            description,
            icon_url
          ),
          images:item_id (
            id,
            title,
            description,
            image_url
          ),
          articles:item_id (
            id,
            title,
            summary,
            image_url
          ),
          books:item_id (
            id,
            title,
            author,
            cover_url
          )
        `)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transformar os dados para um formato uniforme
      const favorites: FavoriteItem[] = data.map((item: any) => {
        const favoriteItem: FavoriteItem = {
          id: item.id,
          type: item.item_type,
          title: "",
          created_at: item.created_at,
        }

        switch (item.item_type) {
          case "game":
            if (item.games) {
              favoriteItem.title = item.games.name
              favoriteItem.description = item.games.description
              favoriteItem.thumbnail_url = item.games.thumbnail_url
            }
            break
          case "category":
            if (item.categories) {
              favoriteItem.title = item.categories.name
              favoriteItem.description = item.categories.description
              favoriteItem.thumbnail_url = item.categories.icon_url
            }
            break
          case "image":
            if (item.images) {
              favoriteItem.title = item.images.title
              favoriteItem.description = item.images.description
              favoriteItem.thumbnail_url = item.images.image_url
            }
            break
          case "article":
            if (item.articles) {
              favoriteItem.title = item.articles.title
              favoriteItem.description = item.articles.summary
              favoriteItem.thumbnail_url = item.articles.image_url
            }
            break
          case "book":
            if (item.books) {
              favoriteItem.title = item.books.title
              favoriteItem.description = item.books.author
              favoriteItem.thumbnail_url = item.books.cover_url
            }
            break
        }

        return favoriteItem
      })

      return favorites
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error)
      throw error
    }
  },

  async addFavorite(
    profileId: string,
    itemId: string,
    itemType: "game" | "category" | "image" | "article" | "book",
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Verificar se já existe
      const { data: existingData, error: checkError } = await supabase
        .from("favorites")
        .select("id")
        .eq("profile_id", profileId)
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 é o código para "não encontrado", que é o que esperamos
        throw checkError
      }

      if (existingData) {
        return { success: true, error: null } // Já está nos favoritos
      }

      // Adicionar aos favoritos
      const { error } = await supabase.from("favorites").insert([
        {
          profile_id: profileId,
          item_id: itemId,
          item_type: itemType,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error)
      return { success: false, error: "Não foi possível adicionar aos favoritos" }
    }
  },

  async removeFavorite(favoriteId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.from("favorites").delete().eq("id", favoriteId)

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error("Erro ao remover favorito:", error)
      return { success: false, error: "Não foi possível remover dos favoritos" }
    }
  },

  async checkIsFavorite(
    profileId: string,
    itemId: string,
    itemType: "game" | "category" | "image" | "article" | "book",
  ): Promise<{ isFavorite: boolean; favoriteId: string | null }> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("profile_id", profileId)
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      return {
        isFavorite: !!data,
        favoriteId: data ? data.id : null,
      }
    } catch (error) {
      console.error("Erro ao verificar favorito:", error)
      return { isFavorite: false, favoriteId: null }
    }
  },
}
