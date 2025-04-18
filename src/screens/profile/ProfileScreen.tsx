import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';

const ProfileScreen: React.FC = () => {
  const { logoutMutation } = useAuth();
  
  // In a real app, we would fetch this from the auth context
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'client',
    joinDate: 'January 2023',
    avatar: null, // placeholder for profile image
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
          <Text style={styles.role}>
            {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userProfile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>
              {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since:</Text>
            <Text style={styles.infoValue}>{userProfile.joinDate}</Text>
          </View>
        </Card>

        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <Button
            title="Edit Profile"
            variant="outline"
            onPress={() => console.log('Edit Profile')}
            style={styles.actionButton}
          />
          <Button
            title="Change Password"
            variant="outline"
            onPress={() => console.log('Change Password')}
            style={styles.actionButton}
          />
          <Button
            title="Privacy Settings"
            variant="outline"
            onPress={() => console.log('Privacy Settings')}
            style={styles.actionButton}
          />
          <Button
            title="Logout"
            variant="primary"
            onPress={handleLogout}
            loading={logoutMutation.isPending}
            style={[styles.actionButton, styles.logoutButton]}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: SPACING.MEDIUM,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.TINY,
  },
  email: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.TINY,
  },
  role: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.PILL,
  },
  infoCard: {
    marginBottom: SPACING.LARGE,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  actionsCard: {
    marginBottom: SPACING.LARGE,
  },
  actionButton: {
    marginBottom: SPACING.MEDIUM,
  },
  logoutButton: {
    marginTop: SPACING.SMALL,
  },
});

export default ProfileScreen;