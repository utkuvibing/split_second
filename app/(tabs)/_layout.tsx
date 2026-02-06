import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../../lib/themeContext';
import { t } from '../../lib/i18n';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.background,
          borderTopWidth: 1,
          height: 68 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'none',
          marginTop: 2,
          marginBottom: 4,
          lineHeight: 18,
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
        name="index"
        options={{
          title: t('tabToday'),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>⚡</Text>
          ),
          tabBarShowIcon: true,
        }}
      />
      <MaterialTopTabs.Screen
        name="leaderboard"
        options={{
          title: t('tabLeaderboard'),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>🏆</Text>
          ),
          tabBarShowIcon: true,
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>👤</Text>
          ),
          tabBarShowIcon: true,
        }}
      />
    </MaterialTopTabs>
  );
}
