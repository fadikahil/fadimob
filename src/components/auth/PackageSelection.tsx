import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Dialog, { DialogFooter } from '../ui/Dialog';
import { Package } from '../../types/auth';

interface PackageSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  selectedPackage: number | null;
  onSelect: (packageId: number) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({
  isOpen,
  onClose,
  packages,
  selectedPackage,
  onSelect,
  onConfirm,
  isLoading,
}) => {
  const { colors } = useTheme();
  
  // Render PackageCard
  const PackageCard = ({ pkg, isSelected }: { pkg: Package; isSelected: boolean }) => (
    <TouchableOpacity
      style={[
        styles.packageCard,
        {
          borderColor: isSelected ? colors.primary : colors.border,
          backgroundColor: isSelected ? `${colors.primary}10` : colors.card,
        },
      ]}
      onPress={() => onSelect(pkg.id)}
    >
      {pkg.isPopular && (
        <View
          style={[styles.popularBadge, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.popularText, { color: '#FFFFFF' }]}>Popular</Text>
        </View>
      )}
      
      <View style={styles.packageHeader}>
        <Text style={[styles.packageName, { color: colors.text }]}>{pkg.name}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </View>
      
      <View style={styles.packagePrice}>
        {pkg.requestQuote ? (
          <Text style={[styles.requestQuote, { color: colors.text }]}>
            Request Quote
          </Text>
        ) : (
          <Text style={[styles.price, { color: colors.text }]}>
            {pkg.currency}{pkg.price}
            <Text style={styles.pricePeriod}> / month</Text>
          </Text>
        )}
      </View>
      
      <Text style={[styles.packageDescription, { color: colors.gray[600] }]}>
        {pkg.description}
      </Text>
      
      <View style={styles.featuresContainer}>
        {pkg.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.success}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Select a Package"
      description="Choose the package that best fits your needs. You can upgrade or downgrade later."
      footer={
        <DialogFooter
          cancelText="Cancel"
          confirmText="Continue"
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmDisabled={selectedPackage === null}
          confirmLoading={isLoading}
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {packages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Loading packages...
            </Text>
          </View>
        ) : (
          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPackage === pkg.id}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  packagesContainer: {
    paddingVertical: 8,
  },
  packageCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '600',
  },
  packagePrice: {
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: '400',
  },
  requestQuote: {
    fontSize: 18,
    fontWeight: '600',
  },
  packageDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default PackageSelection;