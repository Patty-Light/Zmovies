import { LatestMovies, Search_Movies, getMovieById } from "@/api/omdb";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window")

export default function Index() {
  const router = useRouter();
  const [movies, setMovies] = useState<any>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadLatestMovies = async () => {
    setLoading(true);
    try {
      const data = await LatestMovies();
      const full = await Promise.all(data.Search.map((m: any) => getMovieById(m.imdbID)));
      setMovies(full);
      setFeatured(full[0]);
    } catch (error) {
      console.error("Error fetching latest movies : ", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async () => {
    const searchQuery = search.trim();
    if (searchQuery === "") return;

    setLoading(true);

    try {
      const data = await Search_Movies(searchQuery);
      const full = await Promise.all(data.Search.map((m: any) => getMovieById(m.imdbID)));
      setMovies(full);
      setFeatured(full[0]);
    } catch (error) {
      console.error("Error searching movie : ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLatestMovies();
  }, []);

  const getPosterUrl = (poster?: string) => {
    if (poster && poster !== "N/A") return poster;
    return "https://via.placeholder.com/300x450.png?text=No+Image";
  };

  const featuredMovies = movies.slice(0, 5);
  const highRatedMovies = movies.slice(0, 6);

  const renderMovie = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => router.push(`/movie/${item.imdbID}`)} style={styles.movieCard}>
        <Image
          source={{ uri: getPosterUrl(item.Poster) }}
          style={styles.moviePoster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{item.Title}</Text>
          <Text style={styles.movieMeta}>Year: {item.Year}</Text>
          <Text style={styles.movieMeta}>Type: {item.Type}</Text>
          <Text style={styles.movieMeta}>Genre: {item.Genre}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Header />
      <View style={styles.body}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search for movies..."
            placeholderTextColor="#8B7DBA"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        {featuredMovies.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Picks</Text>
              <Text style={styles.sectionSubtitle}>Swipe through top picks</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              style={styles.carousel}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
                setActiveIndex(index);
              }}
            >
              {featuredMovies.map((movie: any) => (
                <TouchableOpacity
                  key={movie.imdbID}
                  activeOpacity={0.95}
                  onPress={() => router.push(`/movie/${movie.imdbID}`)}
                  style={[styles.carouselItem, { width: width - 32 }]}
                >
                  <Image source={{ uri: getPosterUrl(movie.Poster) }} style={styles.carouselPoster} resizeMode="cover" />
                  <View style={styles.carouselOverlay}>
                    <Text style={styles.carouselBadge}>Now Streaming</Text>
                    <Text style={styles.carouselTitle}>{movie.Title}</Text>
                    <Text style={styles.carouselMeta}>{movie.Genre}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.dotRow}>
              {featuredMovies.map((_: any, index: number) => (
                <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.heroCard}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroEyebrow}>Trending this week</Text>
            <Text style={styles.heroTitle}>{featured?.Title || "Discover your next obsession"}</Text>
            <Text style={styles.heroMeta}>{featured?.Genre || "Drama, Thriller, Sci-Fi"}</Text>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => featured && router.push(`/movie/${featured.imdbID}`)}>
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.playText}>Watch</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <Text style={styles.sectionSubtitle}>Fresh picks for you</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingRow}>
          {movies.slice(0, 6).map((movie: any) => (
            <TouchableOpacity key={movie.imdbID} style={styles.trendingCard} onPress={() => router.push(`/movie/${movie.imdbID}`)}>
              <Image source={{ uri: getPosterUrl(movie.Poster) }} style={styles.trendingPoster} resizeMode="cover" />
              <Text style={styles.trendingTitle} numberOfLines={1}>{movie.Title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.categoryCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>High Rated</Text>
            <Text style={styles.sectionSubtitle}>Critics’ favorite picks</Text>
          </View>
          {highRatedMovies.map((movie: any) => (
            <View key={movie.imdbID}>
              {renderMovie({ item: movie })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06020D" },
  contentContainer: { flexGrow: 1, paddingBottom: 28 },
  body: { padding: 16, gap: 16 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17112A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#6D28D9",
  },
  input: { flex: 1, color: "#F5F3FF", fontSize: 16, paddingVertical: 6 },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#F5F3FF", fontSize: 16, textAlign: "center", paddingVertical: 8 },
  sectionHeader: { marginTop: 4, marginBottom: 6 },
  sectionTitle: { color: "#F5F3FF", fontSize: 19, fontWeight: "700" },
  sectionSubtitle: { color: "#D8B4FE", fontSize: 13, marginTop: 3 },
  carousel: { marginTop: 8, borderRadius: 20, overflow: "hidden" },
  carouselItem: { height: 240, borderRadius: 20, overflow: "hidden", position: "relative" },
  carouselPoster: { width: "100%", height: "100%" },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  carouselBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(236,72,153,0.9)",
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  carouselTitle: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  carouselMeta: { color: "#FCE7F3", fontSize: 13 },
  dotRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#43315E" },
  dotActive: { backgroundColor: "#F472B6", width: 18 },
  heroCard: {
    backgroundColor: "#1B1130",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6D28D9",
  },
  heroTextBlock: { flex: 1, gap: 4 },
  heroEyebrow: { color: "#F9A8D4", fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
  heroTitle: { color: "#F5F3FF", fontSize: 19, fontWeight: "700" },
  heroMeta: { color: "#D8B4FE", fontSize: 14 },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EC4899",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  playText: { color: "#fff", fontWeight: "700" },
  trendingRow: { flexGrow: 0, marginBottom: 8 },
  trendingCard: {
    width: 110,
    marginRight: 10,
    backgroundColor: "#161028",
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: "#4C2E9A",
  },
  trendingPoster: { width: "100%", height: 140, borderRadius: 10, marginBottom: 6 },
  trendingTitle: { color: "#F5F3FF", fontSize: 13, fontWeight: "600" },
  categoryCard: {
    backgroundColor: "#120B22",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3B236D",
  },
  movieCard: {
    flexDirection: "row",
    backgroundColor: "#161028",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#33225D",
    marginBottom: 10,
  },
  moviePoster: { width: 110, height: 150, borderRadius: 10 },
  movieInfo: { flex: 1, paddingVertical: 4, gap: 6 },
  movieTitle: { color: "#F5F3FF", fontSize: 16, fontWeight: "700" },
  movieMeta: { color: "#D8B4FE", fontSize: 14 },
})