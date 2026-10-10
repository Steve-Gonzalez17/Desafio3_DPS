export const Colors = {
  light: {
    primary: '#4F46E5', // Indigo 600
    primaryDark: '#3730A3', // Indigo 800
    primaryLight: '#EEF2FF', // Indigo 50
    primaryGradient: ['#4F46E5', '#6366F1'],
    
    accent: '#10B981', // Emerald 500
    accentDark: '#047857', // Emerald 700
    accentLight: '#ECFDF5', // Emerald 50
    
    warning: '#F59E0B', // Amber 500
    warningLight: '#FEF3C7',
    
    danger: '#EF4444', // Red 500
    dangerLight: '#FEF2F2',
    dangerDark: '#B91C1C',
    
    background: '#F8FAFC', // Slate 50
    cardBackground: '#FFFFFF',
    surfaceSubtle: '#F1F5F9', // Slate 100
    
    border: '#E2E8F0', // Slate 200
    borderFocus: '#6366F1',
    
    text: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    textMuted: '#94A3B8', // Slate 400
    
    white: '#FFFFFF',
  },
  dark: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#1E1B4B',
    primaryGradient: ['#6366F1', '#818CF8'],
    
    accent: '#34D399',
    accentDark: '#10B981',
    accentLight: '#064E3B',
    
    warning: '#FBBF24',
    warningLight: '#78350F',
    
    danger: '#F87171',
    dangerLight: '#7F1D1D',
    dangerDark: '#EF4444',
    
    background: '#0F172A',
    cardBackground: '#1E293B',
    surfaceSubtle: '#334155',
    
    border: '#334155',
    borderFocus: '#818CF8',
    
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    
    white: '#FFFFFF',
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 7,
  },
};

export const Theme = Colors.light;
