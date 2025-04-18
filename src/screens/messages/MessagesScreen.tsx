import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    name: 'Jane Smith',
    lastMessage: 'Looking forward to our session tomorrow!',
    timestamp: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Michael Johnson',
    lastMessage: 'Thanks for the advice. It was very helpful.',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    lastMessage: 'Can we reschedule our meeting?',
    timestamp: 'Yesterday',
    unread: 1,
  },
  {
    id: '4',
    name: 'Robert Davis',
    lastMessage: 'The payment has been processed.',
    timestamp: 'Aug 15',
    unread: 0,
  },
  {
    id: '5',
    name: 'Emma Thompson',
    lastMessage: "I'll send you the documents shortly.",
    timestamp: 'Aug 14',
    unread: 0,
  },
];

const MessagesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search query
  const filteredConversations = mockConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.conversationItem}
              onPress={() => console.log(`Open conversation with ${item.name}`)}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.conversationDetails}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text style={styles.conversationTime}>{item.timestamp}</Text>
                </View>
                
                <View style={styles.conversationFooter}>
                  <Text 
                    style={styles.conversationMessage}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.lastMessage}
                  </Text>
                  
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations found</Text>
        </View>
      )}
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
  conversationsList: {
    paddingVertical: SPACING.SMALL,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.CARD,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.TINY,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  conversationTime: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
    marginRight: SPACING.SMALL,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
});

export default MessagesScreen;