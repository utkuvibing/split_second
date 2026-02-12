import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFE',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFE',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A7A9BE',
    textAlign: 'center',
  },
  button: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFE',
    textAlign: 'center',
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A7A9BE',
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFE',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  percentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFE',
  },
});
