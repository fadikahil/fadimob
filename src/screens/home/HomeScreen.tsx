import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Card, TouchableCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/utils/theme';

// Mock data for services (will be replaced with actual API data)
const featuredServices = [
  {
    id: '1',
    title: 'Executive Coaching',
    provider: 'Jane Smith',
    category: 'Career Development',
  },
  {
    id: '2',
    title: 'Fitness Training',
    provider: 'Mark Johnson',
    category: 'Health & Wellness',
  },
  {
    id: '3',
    title: 'Financial Consulting',
    provider: 'Sarah Williams',
    category: 'Finance',
  },
];

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>TLOBNI</Text>
          <Text style={styles.tagline}>Connecting you to expert services</Text>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find Services</Text>
          <Button 
            title="Search Services" 
            variant="secondary"
            onPress={() => console.log('Search pressed')}
            style={styles.searchButton}
          />
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <FlatList
            data={featuredServices}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <TouchableCard
                style={styles.serviceCard}
                onPress={() => console.log(`Selected service: ${item.title}`)}
              >
                <View style={styles.serviceCardContent}>
                  <Text style={styles.serviceCardTitle}>{item.title}</Text>
                  <Text style={styles.serviceCardProvider}>{item.provider}</Text>
                  <Text style={styles.serviceCardCategory}>{item.category}</Text>
                </View>
              </TouchableCard>
            )}
          />
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {['Business', 'Health', 'Education', 'Lifestyle'].map((category, index) => (
              <TouchableCard
                key={index}
                style={styles.categoryCard}
                onPress={() => console.log(`Selected category: ${category}`)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableCard>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: SPACING.LARGE,
    backgroundColor: COLORS.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: SPACING.LARGE,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
  },
  searchSection: {
    marginBottom: SPACING.LARGE,
  },
  searchButton: {
    marginHorizontal: SPACING.MEDIUM,
  },
  featuredSection: {
    marginBottom: SPACING.LARGE,
  },
  featuredList: {
    paddingLeft: SPACING.MEDIUM,
    paddingRight: SPACING.SMALL,
  },
  serviceCard: {
    width: 200,
    marginRight: SPACING.MEDIUM,
  },
  serviceCardContent: {
    padding: SPACING.MEDIUM,
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  serviceCardProvider: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  serviceCardCategory: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  categoriesSection: {
    marginBottom: SPACING.XLARGE,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.MEDIUM,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: SPACING.MEDIUM,
    height: 80,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
});

export default HomeScreen;