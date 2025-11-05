import { useTheme } from '@/contexts/ThemeContext';

export const SunBackground = () => {
  const { theme } = useTheme();

  if (theme !== 'sun') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Radial gradient sun flare */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 30%, rgba(255, 200, 100, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 150, 50, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 20% 40%, rgba(255, 220, 150, 0.2) 0%, transparent 35%)
          `,
        }}
      />
    </div>
  );
};
