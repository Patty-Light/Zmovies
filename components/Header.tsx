import { MaterialIcons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.brandWrap}>
                <View style={styles.iconWrap}>
                    <MaterialIcons name="local-movies" size={26} color="#fff" />
                </View>
                <View>
                    <Text style={styles.title}>ZMovies</Text>
                    <Text style={styles.subtitle}>Premium streaming</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => alert("Notifications")} style={styles.iconButton}>
                <MaterialIcons name="notifications" size={22} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: 36,
        paddingBottom: 16,
        backgroundColor: '#120A24',
        borderBottomWidth: 1,
        borderBottomColor: '#3B236D',
    },
    brandWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7C3AED',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    subtitle: {
        color: '#C4B5FD',
        fontSize: 12,
        marginTop: 2,
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#241246',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4C2E9A',
    },
})