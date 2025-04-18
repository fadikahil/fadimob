import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { TouchableCard } from '@/components/ui/Card';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';

// Mock data for services
const mockServices = [
  {
    id: '1',
    title: 'Executive Coaching',
    provider: 'Jane Smith',
    category: 'Career Development',
    price: 150,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Fitness Training',
    provider: 'Mark Johnson',
    category: 'Health & Wellness',
    price: 80,
    rating: 4.5,
  },
  {
    id: '3',
    title: 'Financial Consulting',
    provider: 'Sarah Williams',
    category: 'Finance',
    price: 200,
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Yoga Instruction',
    provider: 'Emily Davis',
    category: 'Health & Wellness',
    price: 60,
    rating: 4.7,
  },
  {
    id: '5',
    title: 'Web Development',
    provider: 'Michael Brown',
    category: 'Technology',
    price: 120,
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Interior Design',
    provider: 'Olivia Wilson',
    category: 'Home & Lifestyle',
    price: 90,
    rating: 4.4,
  },
];

const categories = [
  'All Categories',
  'Career Development',
  'Health & Wellness',
  'Finance',
  'Technology',
  'Home & Lifestyle',
];

const ServicesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Filter services based on search query and selected category
  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                           service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Explore Services</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services or providers"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text 
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.selectedCategoryChipText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
        renderItem={({ item }) => (
          <TouchableCard
            style={styles.serviceCard}
            onPress={() => console.log(`Selected service: ${item.title}`)}
          >
            <View style={styles.serviceCardContent}>
              <Text style={styles.serviceCardTitle}>{item.title}</Text>
              <Text style={styles.serviceCardProvider}>{item.provider}</Text>
              <View style={styles.serviceDetailsRow}>
                <Text style={styles.serviceCardCategory}>{item.category}</Text>
                <Text style={styles.serviceCardPrice}>${item.price}/hr</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.ratingStars}>★★★★★</Text>
              </View>
            </View>
          </TouchableCard>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.PRIMARY,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.MEDIUM,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: SPACING.SMALL,
  },
  categoriesContainer: {
    marginVertical: SPACING.MEDIUM,
  },
  categoriesList: {
    paddingHorizontal: SPACING.MEDIUM,
  },
  categoryChip: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    backgroundColor: COLORS.CARD,
    borderRadius: BORDER_RADIUS.PILL,
    marginRight: SPACING.SMALL,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  selectedCategoryChipText: {
    color: 'white',
    fontWeight: '500',
  },
  servicesList: {
    padding: SPACING.MEDIUM,
  },
  serviceCard: {
    marginBottom: SPACING.MEDIUM,
  },
  serviceCardContent: {
    padding: SPACING.MEDIUM,
  },
  serviceCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.TINY,
  },
  serviceCardProvider: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SMALL,
  },
  serviceDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SMALL,
  },
  serviceCardCategory: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY / 2,
    borderRadius: BORDER_RADIUS.PILL,
  },
  serviceCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginRight: SPACING.TINY,
  },
  ratingStars: {
    color: '#FFD700', // Gold color for stars
    fontSize: 14,
  },
});

export default ServicesScreen;