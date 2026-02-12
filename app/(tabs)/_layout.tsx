import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/themeContext';
import { useFriendRequests } from '../../hooks/useFriendRequests';
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
          paddingTop: 4,
          ...SHADOW.sm,
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
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons name={focused ? 'flash' : 'flash-outline'} size={20} color={color} />
          ),
          tabBarShowIcon: true,
        }}
      />
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
