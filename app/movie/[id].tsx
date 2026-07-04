import { getMovieById } from '@/api/omdb'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

const movieDetail = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadMovieDetail = async () => {
        const movieId = Array.isArray(id) ? id[0] : id;
        if (!movieId) {
            setMovie(null);
            return;
        }

        setLoading(true);
        try {
            const data = await getMovieById(movieId);
            setMovie(data && data.Response === 'True' ? data : null);
        } catch (error) {
            console.error("error ftching movie detail. ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMovieDetail()
    }, [id])

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text style={styles.centerText}>Loading movie...</Text>
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.centered}>
                <Text style={styles.centerText}>Movie not found</Text>
            </View>
        );
    }

    const posterUrl = movie.Poster && movie.Poster !== 'N/A'
        ? movie.Poster
        : 'https://via.placeholder.com/300x450.png?text=No+Image';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.card}>
                <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
                <Text style={[styles.text, styles.title]}>{movie.Title}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={22} color="#FBBF24" />
                    <Text style={styles.ratingText}>{movie.imdbRating}</Text>
                </View>
                <Text style={styles.label}>Genre: {movie.Genre}</Text>
                <Text style={styles.label}>Plot: {movie.Plot}</Text>
                <Text style={styles.label}>Director: {movie.Director}</Text>
                <Text style={styles.label}>Starred: {movie.Actors}</Text>
                <Text style={styles.label}>Released: {movie.Released}</Text>
            </View>
        </ScrollView>
    )
}

export default movieDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0B1F",
    },
    contentContainer: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#0F0B1F",
    },
    centerText: {
        color: '#F5F3FF',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#1B1435',
        borderRadius: 18,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#4C2E9A',
    },
    poster: {
        width: 220,
        height: 320,
        borderRadius: 14,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: '#F5F3FF',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    ratingText: {
        color: '#FBBF24',
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        color: "#EDE9FE",
        fontSize: 15,
        lineHeight: 22,
    },
    text: {
        color: "#F8FAFC",
        fontSize: 18,
    }
})