import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/themeContext';
import { useFriendRequests } from '../../hooks/useFriendRequests';
import { TodayTabIcon } from '../../components/TodayTabIcon';
import { SHADOW } from '../../constants/ui';
import { t } from '../../lib/i18n';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const { pendingCount } = useFriendRequests();

  return (
    <MaterialTopTabs
      initialRouteName="index"
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarStyle: {
          backgroundColor: colors.surface + 'E6',
          borderTopColor: colors.background,
          borderTopWidth: 1,
          height: 68 + bottomPadding,
          paddingBottom: bottomPadding,
          overflow: 'visible' as const,
          ...SHADOW.sm,
        },
        tabBarItemStyle: {
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          height: 68,
          overflow: 'visible' as const,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          textTransform: 'none',
          marginTop: 2,
          marginBottom: 0,
          lineHeight: 16,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.accent,
          height: 2,
          borderRadius: 1,
        },
        tabBarPressColor: 'transparent',
      }}
    >
      <MaterialTopTabs.Screen
        name="leaderboard"
        options={{
          title: t('tabLeaderboard'),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={20} color={color} />
          ),
          tabBarShowIcon: true,
        }}
      />
      <MaterialTopTabs.Screen
        name="matching"
        options={{
          title: t('tabMatching'),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={20} color={color} />
          ),
          tabBarShowIcon: true,
        }}
      />
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: t('tabToday'),
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TodayTabIcon focused={focused} color={color} accentColor={colors.accent} />
          ),
          tabBarShowIcon: true,
        }}
      />
      <MaterialTopTabs.Screen
        name="community"
        options={{
          title: t('tabCommunity'),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={20} color={color} />
          ),
          tabBarShowIcon: true,
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <View>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />
              {pendingCount > 0 && (
                <View style={{
                  position: 'absolute', top: -2, right: -6,
                  backgroundColor: colors.warning, width: 10, height: 10,
                  borderRadius: 5,
                }} />
              )}
            </View>
          ),
          tabBarShowIcon: true,
        }}
      />
    </MaterialTopTabs>
  );
}
