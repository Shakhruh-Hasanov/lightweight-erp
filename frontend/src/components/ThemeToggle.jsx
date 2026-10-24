import { THEMES, useTheme } from '../theme';
import Icon from './Icon';

const LABELS = { system: 'System', light: 'Light', dark: 'Dark' };
const ICONS = { system: 'monitor', light: 'sun', dark: 'moon' };

// Three small buttons: System · Light · Dark. The selected one is highlighted.
export default function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Color theme">
      {THEMES.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={theme === option}
          className={`theme-option ${theme === option ? 'selected' : ''}`}
          onClick={() => setTheme(option)}
          title={`${LABELS[option]} theme`}
        >
          <Icon name={ICONS[option]} size={15} />
          <span>{LABELS[option]}</span>
        </button>
      ))}
    </div>
  );
}
