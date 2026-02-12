import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { ThemeColors } from '../types/premium';
import { AVATAR_CATEGORIES, AVATAR_COIN_PRICE, getAvatarsByCategory, getAvatarPrice, AvatarCategory, AvatarDef } from '../lib/avatars';
import { setAvatar, purchaseAvatar, getOwnedAvatars } from '../lib/avatar';
import { t, TranslationKey } from '../lib/i18n';

interface Props {
  visible: boolean;
  currentAvatarId: string | null;
  isPremium: boolean;
  coins: number;
  onClose: () => void;
  onSaved: (avatarId: string | null) => void;
}

const CATEGORY_KEYS: Record<AvatarCategory, TranslationKey> = {
  animals: 'avatarCategoryAnimals',
  people: 'avatarCategoryPeople',
  objects: 'avatarCategoryObjects',
  nature: 'avatarCategoryNature',
};

export function AvatarPickerModal({ visible, currentAvatarId, isPremium, coins, onClose, onSaved }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);
  const [selected, setSelected] = useState<string | null>(currentAvatarId);
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('animals');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ownedAvatars, setOwnedAvatars] = useState<Set<string>>(new Set());

  const fetchOwned = useCallback(async () => {
    const owned = await getOwnedAvatars();
    setOwnedAvatars(new Set(owned));
  }, []);

  useEffect(() => {
    if (visible) fetchOwned();
  }, [visible, fetchOwned]);

  const avatars = getAvatarsByCategory(activeCategory);

  const isUnlocked = (av: AvatarDef): boolean => {
    if (av.tier === 'free') return true;
    if (av.tier === 'premium') return isPremium;
    if (av.tier === 'coin') return ownedAvatars.has(av.id);
    return false;
  };

  const handleSelect = (av: AvatarDef) => {
    setError(null);
    if (isUnlocked(av)) {
      setSelected(av.id);
    }
    // locked avatars: do nothing on tap, user must buy first
  };

  const handleBuy = async (av: AvatarDef) => {
    if (loading) return;
    setError(null);
    const price = getAvatarPrice(av.id);
    if (coins < price) {
      setError(t('avatarInsufficientCoins'));
      return;
    }
    setLoading(true);
    const result = await purchaseAvatar(av.id, price);
    if (result.success) {
      setOwnedAvatars(prev => new Set([...prev, av.id]));
      setSelected(av.id);
    } else if (result.error === 'insufficient_coins') {
      setError(t('avatarInsufficientCoins'));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    const result = await setAvatar(selected);
    if (result.success) {
      setSuccess(true);
      onSaved(selected);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setSelected(currentAvatarId);
    onClose();
  };

  const renderAvatarCell = (av: AvatarDef) => {
    const unlocked = isUnlocked(av);
    const isSelected = selected === av.id;

    return (
      <View key={av.id} style={styles.cellWrapper}>
        <Pressable
          style={[
            styles.avatarCell,
            isSelected && styles.avatarSelected,
            !unlocked && styles.avatarLocked,
          ]}
          onPress={() => unlocked ? handleSelect(av) : undefined}
        >
          <Text style={[styles.emoji, !unlocked && styles.emojiLocked]}>{av.emoji}</Text>
          {/* Lock / tier badge */}
          {av.tier === 'premium' && !isPremium && (
            <View style={[styles.tierBadge, { backgroundColor: colors.accent }]}>
              <Ionicons name="star" size={10} color="#fff" />
            </View>
          )}
          {av.tier === 'coin' && !ownedAvatars.has(av.id) && (
            <View style={[styles.tierBadge, { backgroundColor: colors.warning }]}>
              <Text style={styles.tierBadgeText}>{getAvatarPrice(av.id)}</Text>
            </View>
          )}
        </Pressable>
        {/* Buy button for unowned coin avatars */}
        {av.tier === 'coin' && !ownedAvatars.has(av.id) && (
          <Pressable
            style={[styles.buyButton, coins < getAvatarPrice(av.id) && styles.buyButtonDisabled]}
            onPress={() => handleBuy(av)}
            disabled={loading || coins < getAvatarPrice(av.id)}
          >
            <Text style={styles.buyButtonText}>{t('avatarBuy')}</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.content} onPress={() => {}}>
          <Text style={styles.title}>{t('chooseAvatar')}</Text>

          {/* Category tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
            {AVATAR_CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.tab, activeCategory === cat && styles.tabActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[
                  styles.tabText,
                  activeCategory === cat && styles.tabTextActive,
                ]}>
                  {t(CATEGORY_KEYS[cat])}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Avatar grid */}
          <ScrollView style={styles.gridScroll} contentContainerStyle={styles.grid}>
            {/* No avatar option */}
            <View style={styles.cellWrapper}>
              <Pressable
                style={[styles.avatarCell, selected === null && styles.avatarSelected]}
                onPress={() => { setSelected(null); setError(null); }}
              >
                <Ionicons name="person" size={24} color={colors.textMuted} />
              </Pressable>
            </View>
            {avatars.map(renderAvatarCell)}
          </ScrollView>

          {error && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.error}>
              {error}
            </Animated.Text>
          )}

          {success && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.success}>
              {t('avatarSaved')}
            </Animated.Text>
          )}

          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? '...' : t('save')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 380,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  tabs: {
    flexGrow: 0,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text,
  },
  gridScroll: {
    maxHeight: 280,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  cellWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  avatarCell: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: colors.accent,
  },
  avatarLocked: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 28,
  },
  emojiLocked: {
    opacity: 0.6,
  },
  tierBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },
  buyButton: {
    backgroundColor: colors.warning,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  buyButtonDisabled: {
    opacity: 0.4,
  },
  buyButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  error: {
    fontSize: 13,
    color: colors.warning,
    textAlign: 'center',
  },
  success: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
