/* =========================================================
   ASS Lyric Replacer — Theme Data & Core Manager
   Loaded synchronously (no defer/async) in <head>, BEFORE
   style.css finishes rendering, so we can apply the saved
   theme's CSS variables before first paint (anti-FOUC).

   To add a new theme later: just push one object into
   THEME_LIST below. No other file needs to change.
   ========================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'ass-app-theme';

  /* Each theme = { id, name, icon, dark, swatch[3], vars{} }
     vars keys map directly to CSS custom properties (without --).
     structural: optional string used as a class on <html> for
     themes that need extra structural CSS (glass / neumorphism /
     monochrome) beyond simple color-variable swaps. */
  var THEME_LIST = [
    {
      id: 'dark', name: 'Dark', icon: 'fa-moon', dark: true,
      swatch: ['#0F172A', '#6C63FF', '#8B5CF6'],
      vars: {
        'accent-1': '#6C63FF', 'accent-2': '#4F46E5', 'accent-3': '#8B5CF6',
        'bg-base': '#0F172A', 'bg-base-2': '#131c33', 'bg-base-3': '#0B1120',
        'glass-bg': 'rgba(255,255,255,0.055)', 'glass-bg-strong': 'rgba(255,255,255,0.09)', 'glass-border': 'rgba(255,255,255,0.12)',
        'text-primary': '#F1F5F9', 'text-secondary': '#94A3B8', 'text-muted': '#64748B',
        'success': '#34D399', 'danger': '#F87171', 'warning': '#FBBF24',
        'overlay-soft': 'rgba(255,255,255,0.02)', 'overlay-mid': 'rgba(255,255,255,0.05)', 'overlay-strong': 'rgba(255,255,255,0.08)',
        'modal-bg-1': 'rgba(30,27,60,0.9)', 'modal-bg-2': 'rgba(15,23,42,0.95)', 'modal-backdrop': 'rgba(5,8,20,0.65)'
      }
    },
    {
      id: 'light', name: 'Light', icon: 'fa-sun', dark: false,
      swatch: ['#F8FAFC', '#6C63FF', '#0F172A'],
      vars: {
        'accent-1': '#6C63FF', 'accent-2': '#4F46E5', 'accent-3': '#8B5CF6',
        'bg-base': '#F8FAFC', 'bg-base-2': '#EEF2F9', 'bg-base-3': '#FFFFFF',
        'glass-bg': 'rgba(15,23,42,0.04)', 'glass-bg-strong': 'rgba(15,23,42,0.07)', 'glass-border': 'rgba(15,23,42,0.10)',
        'text-primary': '#0F172A', 'text-secondary': '#475569', 'text-muted': '#94A3B8',
        'success': '#059669', 'danger': '#DC2626', 'warning': '#D97706',
        'overlay-soft': 'rgba(15,23,42,0.02)', 'overlay-mid': 'rgba(15,23,42,0.04)', 'overlay-strong': 'rgba(15,23,42,0.07)',
        'modal-bg-1': 'rgba(255,255,255,0.97)', 'modal-bg-2': 'rgba(248,250,252,0.98)', 'modal-backdrop': 'rgba(15,23,42,0.35)'
      }
    },
    {
      id: 'midnight-blue', name: 'Midnight Blue', icon: 'fa-water', dark: true,
      swatch: ['#050B1A', '#3B82F6', '#60A5FA'],
      vars: {
        'accent-1': '#3B82F6', 'accent-2': '#2563EB', 'accent-3': '#60A5FA',
        'bg-base': '#050B1A', 'bg-base-2': '#0A1428', 'bg-base-3': '#020610',
        'glass-bg': 'rgba(96,165,250,0.06)', 'glass-bg-strong': 'rgba(96,165,250,0.10)', 'glass-border': 'rgba(96,165,250,0.16)',
        'text-primary': '#E2E8F0', 'text-secondary': '#94A3B8', 'text-muted': '#64748B',
        'success': '#10B981', 'danger': '#EF4444', 'warning': '#F59E0B',
        'overlay-soft': 'rgba(255,255,255,0.02)', 'overlay-mid': 'rgba(255,255,255,0.05)', 'overlay-strong': 'rgba(255,255,255,0.08)',
        'modal-bg-1': 'rgba(10,20,40,0.92)', 'modal-bg-2': 'rgba(3,8,20,0.96)', 'modal-backdrop': 'rgba(2,5,12,0.65)'
      }
    },
    {
      id: 'dracula', name: 'Dracula', icon: 'fa-hat-wizard', dark: true,
      swatch: ['#282A36', '#BD93F9', '#FF79C6'],
      vars: {
        'accent-1': '#BD93F9', 'accent-2': '#FF79C6', 'accent-3': '#8BE9FD',
        'bg-base': '#282A36', 'bg-base-2': '#21222C', 'bg-base-3': '#191A21',
        'glass-bg': 'rgba(248,248,242,0.05)', 'glass-bg-strong': 'rgba(248,248,242,0.09)', 'glass-border': 'rgba(248,248,242,0.13)',
        'text-primary': '#F8F8F2', 'text-secondary': '#BFBFD1', 'text-muted': '#6272A4',
        'success': '#50FA7B', 'danger': '#FF5555', 'warning': '#F1FA8C',
        'overlay-soft': 'rgba(248,248,242,0.02)', 'overlay-mid': 'rgba(248,248,242,0.05)', 'overlay-strong': 'rgba(248,248,242,0.08)',
        'modal-bg-1': 'rgba(40,42,54,0.94)', 'modal-bg-2': 'rgba(33,34,44,0.97)', 'modal-backdrop': 'rgba(15,15,20,0.65)'
      }
    },
    {
      id: 'catppuccin-latte', name: 'Catppuccin Latte', icon: 'fa-mug-saucer', dark: false,
      swatch: ['#EFF1F5', '#8839EF', '#EA76CB'],
      vars: {
        'accent-1': '#8839EF', 'accent-2': '#1E66F5', 'accent-3': '#EA76CB',
        'bg-base': '#EFF1F5', 'bg-base-2': '#E6E9EF', 'bg-base-3': '#DCE0E8',
        'glass-bg': 'rgba(76,79,105,0.04)', 'glass-bg-strong': 'rgba(76,79,105,0.07)', 'glass-border': 'rgba(76,79,105,0.13)',
        'text-primary': '#4C4F69', 'text-secondary': '#6C6F85', 'text-muted': '#9CA0B0',
        'success': '#40A02B', 'danger': '#D20F39', 'warning': '#DF8E1D',
        'overlay-soft': 'rgba(76,79,105,0.02)', 'overlay-mid': 'rgba(76,79,105,0.04)', 'overlay-strong': 'rgba(76,79,105,0.07)',
        'modal-bg-1': 'rgba(239,241,245,0.97)', 'modal-bg-2': 'rgba(230,233,239,0.98)', 'modal-backdrop': 'rgba(76,79,105,0.35)'
      }
    },
    {
      id: 'catppuccin-frappe', name: 'Catppuccin Frappé', icon: 'fa-mug-hot', dark: true,
      swatch: ['#303446', '#CA9EE6', '#F4B8E4'],
      vars: {
        'accent-1': '#CA9EE6', 'accent-2': '#8CAAEE', 'accent-3': '#F4B8E4',
        'bg-base': '#303446', 'bg-base-2': '#292C3C', 'bg-base-3': '#232634',
        'glass-bg': 'rgba(198,208,245,0.05)', 'glass-bg-strong': 'rgba(198,208,245,0.08)', 'glass-border': 'rgba(198,208,245,0.13)',
        'text-primary': '#C6D0F5', 'text-secondary': '#A5ADCE', 'text-muted': '#838BA7',
        'success': '#A6D189', 'danger': '#E78284', 'warning': '#E5C890',
        'overlay-soft': 'rgba(198,208,245,0.02)', 'overlay-mid': 'rgba(198,208,245,0.05)', 'overlay-strong': 'rgba(198,208,245,0.08)',
        'modal-bg-1': 'rgba(48,52,70,0.94)', 'modal-bg-2': 'rgba(41,44,60,0.97)', 'modal-backdrop': 'rgba(20,22,30,0.65)'
      }
    },
    {
      id: 'catppuccin-macchiato', name: 'Catppuccin Macchiato', icon: 'fa-coffee', dark: true,
      swatch: ['#24273A', '#C6A0F6', '#F5BDE6'],
      vars: {
        'accent-1': '#C6A0F6', 'accent-2': '#8AADF4', 'accent-3': '#F5BDE6',
        'bg-base': '#24273A', 'bg-base-2': '#1E2030', 'bg-base-3': '#181926',
        'glass-bg': 'rgba(202,211,245,0.05)', 'glass-bg-strong': 'rgba(202,211,245,0.08)', 'glass-border': 'rgba(202,211,245,0.13)',
        'text-primary': '#CAD3F5', 'text-secondary': '#A5ADCB', 'text-muted': '#8087A2',
        'success': '#A6DA95', 'danger': '#ED8796', 'warning': '#EED49F',
        'overlay-soft': 'rgba(202,211,245,0.02)', 'overlay-mid': 'rgba(202,211,245,0.05)', 'overlay-strong': 'rgba(202,211,245,0.08)',
        'modal-bg-1': 'rgba(36,39,58,0.94)', 'modal-bg-2': 'rgba(30,32,48,0.97)', 'modal-backdrop': 'rgba(15,16,24,0.65)'
      }
    },
    {
      id: 'catppuccin-mocha', name: 'Catppuccin Mocha', icon: 'fa-mug-saucer', dark: true,
      swatch: ['#1E1E2E', '#CBA6F7', '#F5C2E7'],
      vars: {
        'accent-1': '#CBA6F7', 'accent-2': '#89B4FA', 'accent-3': '#F5C2E7',
        'bg-base': '#1E1E2E', 'bg-base-2': '#181825', 'bg-base-3': '#11111B',
        'glass-bg': 'rgba(205,214,244,0.05)', 'glass-bg-strong': 'rgba(205,214,244,0.08)', 'glass-border': 'rgba(205,214,244,0.13)',
        'text-primary': '#CDD6F4', 'text-secondary': '#A6ADC8', 'text-muted': '#7F849C',
        'success': '#A6E3A1', 'danger': '#F38BA8', 'warning': '#F9E2AF',
        'overlay-soft': 'rgba(205,214,244,0.02)', 'overlay-mid': 'rgba(205,214,244,0.05)', 'overlay-strong': 'rgba(205,214,244,0.08)',
        'modal-bg-1': 'rgba(30,30,46,0.94)', 'modal-bg-2': 'rgba(24,24,37,0.97)', 'modal-backdrop': 'rgba(10,10,16,0.65)'
      }
    },
    {
      id: 'tokyo-night', name: 'Tokyo Night', icon: 'fa-city', dark: true,
      swatch: ['#1A1B26', '#7AA2F7', '#BB9AF7'],
      vars: {
        'accent-1': '#7AA2F7', 'accent-2': '#BB9AF7', 'accent-3': '#7DCFFF',
        'bg-base': '#1A1B26', 'bg-base-2': '#16161E', 'bg-base-3': '#101014',
        'glass-bg': 'rgba(169,177,214,0.05)', 'glass-bg-strong': 'rgba(169,177,214,0.08)', 'glass-border': 'rgba(169,177,214,0.13)',
        'text-primary': '#C0CAF5', 'text-secondary': '#9AA5CE', 'text-muted': '#565F89',
        'success': '#9ECE6A', 'danger': '#F7768E', 'warning': '#E0AF68',
        'overlay-soft': 'rgba(169,177,214,0.02)', 'overlay-mid': 'rgba(169,177,214,0.05)', 'overlay-strong': 'rgba(169,177,214,0.08)',
        'modal-bg-1': 'rgba(26,27,38,0.94)', 'modal-bg-2': 'rgba(22,22,30,0.97)', 'modal-backdrop': 'rgba(10,10,15,0.65)'
      }
    },
    {
      id: 'rose-pine', name: 'Rosé Pine', icon: 'fa-feather', dark: true,
      swatch: ['#191724', '#C4A7E7', '#EBBCBA'],
      vars: {
        'accent-1': '#C4A7E7', 'accent-2': '#EBBCBA', 'accent-3': '#9CCFD8',
        'bg-base': '#191724', 'bg-base-2': '#1F1D2E', 'bg-base-3': '#141220',
        'glass-bg': 'rgba(224,222,244,0.05)', 'glass-bg-strong': 'rgba(224,222,244,0.08)', 'glass-border': 'rgba(224,222,244,0.13)',
        'text-primary': '#E0DEF4', 'text-secondary': '#908CAA', 'text-muted': '#6E6A86',
        'success': '#9CCFD8', 'danger': '#EB6F92', 'warning': '#F6C177',
        'overlay-soft': 'rgba(224,222,244,0.02)', 'overlay-mid': 'rgba(224,222,244,0.05)', 'overlay-strong': 'rgba(224,222,244,0.08)',
        'modal-bg-1': 'rgba(25,23,36,0.94)', 'modal-bg-2': 'rgba(20,18,32,0.97)', 'modal-backdrop': 'rgba(10,9,16,0.65)'
      }
    },
    {
      id: 'forest', name: 'Forest', icon: 'fa-tree', dark: true,
      swatch: ['#0B1F17', '#34D399', '#6EE7B7'],
      vars: {
        'accent-1': '#34D399', 'accent-2': '#10B981', 'accent-3': '#6EE7B7',
        'bg-base': '#0B1F17', 'bg-base-2': '#0F2A1F', 'bg-base-3': '#07140E',
        'glass-bg': 'rgba(167,243,208,0.05)', 'glass-bg-strong': 'rgba(167,243,208,0.08)', 'glass-border': 'rgba(167,243,208,0.13)',
        'text-primary': '#ECFDF5', 'text-secondary': '#A7D8C4', 'text-muted': '#6B9080',
        'success': '#34D399', 'danger': '#F87171', 'warning': '#FBBF24',
        'overlay-soft': 'rgba(167,243,208,0.02)', 'overlay-mid': 'rgba(167,243,208,0.05)', 'overlay-strong': 'rgba(167,243,208,0.08)',
        'modal-bg-1': 'rgba(11,31,23,0.94)', 'modal-bg-2': 'rgba(7,20,14,0.97)', 'modal-backdrop': 'rgba(3,10,7,0.65)'
      }
    },
    {
      id: 'ocean', name: 'Ocean', icon: 'fa-water', dark: true,
      swatch: ['#071A2C', '#22D3EE', '#38BDF8'],
      vars: {
        'accent-1': '#22D3EE', 'accent-2': '#0EA5E9', 'accent-3': '#38BDF8',
        'bg-base': '#071A2C', 'bg-base-2': '#0B2740', 'bg-base-3': '#041220',
        'glass-bg': 'rgba(186,230,253,0.05)', 'glass-bg-strong': 'rgba(186,230,253,0.08)', 'glass-border': 'rgba(186,230,253,0.13)',
        'text-primary': '#E0F2FE', 'text-secondary': '#93C5FD', 'text-muted': '#5D8CB0',
        'success': '#2DD4BF', 'danger': '#F87171', 'warning': '#FBBF24',
        'overlay-soft': 'rgba(186,230,253,0.02)', 'overlay-mid': 'rgba(186,230,253,0.05)', 'overlay-strong': 'rgba(186,230,253,0.08)',
        'modal-bg-1': 'rgba(7,26,44,0.94)', 'modal-bg-2': 'rgba(4,18,32,0.97)', 'modal-backdrop': 'rgba(2,10,18,0.65)'
      }
    },
    {
      id: 'sunset', name: 'Sunset', icon: 'fa-mountain-sun', dark: true,
      swatch: ['#1F1215', '#FB923C', '#F472B6'],
      vars: {
        'accent-1': '#FB923C', 'accent-2': '#F472B6', 'accent-3': '#FBBF24',
        'bg-base': '#1F1215', 'bg-base-2': '#2A171A', 'bg-base-3': '#150B0D',
        'glass-bg': 'rgba(254,215,170,0.05)', 'glass-bg-strong': 'rgba(254,215,170,0.08)', 'glass-border': 'rgba(254,215,170,0.13)',
        'text-primary': '#FFF1E6', 'text-secondary': '#E0AFA0', 'text-muted': '#9E7B6E',
        'success': '#34D399', 'danger': '#F87171', 'warning': '#FBBF24',
        'overlay-soft': 'rgba(254,215,170,0.02)', 'overlay-mid': 'rgba(254,215,170,0.05)', 'overlay-strong': 'rgba(254,215,170,0.08)',
        'modal-bg-1': 'rgba(31,18,21,0.94)', 'modal-bg-2': 'rgba(21,11,13,0.97)', 'modal-backdrop': 'rgba(10,5,6,0.65)'
      }
    },
    {
      id: 'lavender', name: 'Lavender', icon: 'fa-spa', dark: false,
      swatch: ['#F5F3FF', '#A78BFA', '#C4B5FD'],
      vars: {
        'accent-1': '#A78BFA', 'accent-2': '#8B5CF6', 'accent-3': '#C4B5FD',
        'bg-base': '#F5F3FF', 'bg-base-2': '#EDE9FE', 'bg-base-3': '#FFFFFF',
        'glass-bg': 'rgba(109,40,217,0.04)', 'glass-bg-strong': 'rgba(109,40,217,0.07)', 'glass-border': 'rgba(109,40,217,0.12)',
        'text-primary': '#3B0764', 'text-secondary': '#6D28D9', 'text-muted': '#A78BFA',
        'success': '#10B981', 'danger': '#DC2626', 'warning': '#D97706',
        'overlay-soft': 'rgba(109,40,217,0.02)', 'overlay-mid': 'rgba(109,40,217,0.04)', 'overlay-strong': 'rgba(109,40,217,0.07)',
        'modal-bg-1': 'rgba(245,243,255,0.97)', 'modal-bg-2': 'rgba(237,233,254,0.98)', 'modal-backdrop': 'rgba(59,7,100,0.35)'
      }
    },
    {
      id: 'sakura', name: 'Sakura', icon: 'fa-leaf', dark: false,
      swatch: ['#FFF5F7', '#F472B6', '#FBCFE8'],
      vars: {
        'accent-1': '#F472B6', 'accent-2': '#EC4899', 'accent-3': '#FBCFE8',
        'bg-base': '#FFF5F7', 'bg-base-2': '#FFE4E9', 'bg-base-3': '#FFFFFF',
        'glass-bg': 'rgba(190,24,93,0.04)', 'glass-bg-strong': 'rgba(190,24,93,0.07)', 'glass-border': 'rgba(190,24,93,0.12)',
        'text-primary': '#831843', 'text-secondary': '#BE185D', 'text-muted': '#F472B6',
        'success': '#059669', 'danger': '#DC2626', 'warning': '#D97706',
        'overlay-soft': 'rgba(190,24,93,0.02)', 'overlay-mid': 'rgba(190,24,93,0.04)', 'overlay-strong': 'rgba(190,24,93,0.07)',
        'modal-bg-1': 'rgba(255,245,247,0.97)', 'modal-bg-2': 'rgba(255,228,233,0.98)', 'modal-backdrop': 'rgba(131,24,67,0.35)'
      }
    },
    {
      id: 'coffee', name: 'Coffee', icon: 'fa-mug-hot', dark: true,
      swatch: ['#2B1D14', '#C19A6B', '#D2B48C'],
      vars: {
        'accent-1': '#C19A6B', 'accent-2': '#8B5E3C', 'accent-3': '#D2B48C',
        'bg-base': '#2B1D14', 'bg-base-2': '#21160F', 'bg-base-3': '#180F0A',
        'glass-bg': 'rgba(210,180,140,0.06)', 'glass-bg-strong': 'rgba(210,180,140,0.10)', 'glass-border': 'rgba(210,180,140,0.15)',
        'text-primary': '#F5E9DA', 'text-secondary': '#D2B48C', 'text-muted': '#A0855B',
        'success': '#8FBC8F', 'danger': '#E07856', 'warning': '#E3B23C',
        'overlay-soft': 'rgba(210,180,140,0.02)', 'overlay-mid': 'rgba(210,180,140,0.05)', 'overlay-strong': 'rgba(210,180,140,0.09)',
        'modal-bg-1': 'rgba(43,29,20,0.94)', 'modal-bg-2': 'rgba(33,22,15,0.97)', 'modal-backdrop': 'rgba(16,10,7,0.65)'
      }
    },
    {
      id: 'glass', name: 'Glass', icon: 'fa-vial', dark: true, structural: 'theme-structural-glass',
      swatch: ['#0F172A', '#818CF8', '#A5B4FC'],
      vars: {
        'accent-1': '#818CF8', 'accent-2': '#6366F1', 'accent-3': '#A5B4FC',
        'bg-base': '#0F172A', 'bg-base-2': '#1E293B', 'bg-base-3': '#020617',
        'glass-bg': 'rgba(255,255,255,0.08)', 'glass-bg-strong': 'rgba(255,255,255,0.14)', 'glass-border': 'rgba(255,255,255,0.22)',
        'text-primary': '#F1F5F9', 'text-secondary': '#CBD5E1', 'text-muted': '#94A3B8',
        'success': '#34D399', 'danger': '#F87171', 'warning': '#FBBF24',
        'overlay-soft': 'rgba(255,255,255,0.05)', 'overlay-mid': 'rgba(255,255,255,0.09)', 'overlay-strong': 'rgba(255,255,255,0.14)',
        'modal-bg-1': 'rgba(255,255,255,0.12)', 'modal-bg-2': 'rgba(255,255,255,0.07)', 'modal-backdrop': 'rgba(5,8,20,0.45)'
      }
    },
    {
      id: 'monochrome', name: 'Monochrome', icon: 'fa-circle-half-stroke', dark: true,
      swatch: ['#0A0A0A', '#FFFFFF', '#8C8C8C'],
      vars: {
        'accent-1': '#E5E5E5', 'accent-2': '#FFFFFF', 'accent-3': '#A3A3A3',
        'bg-base': '#0A0A0A', 'bg-base-2': '#141414', 'bg-base-3': '#000000',
        'glass-bg': 'rgba(255,255,255,0.05)', 'glass-bg-strong': 'rgba(255,255,255,0.09)', 'glass-border': 'rgba(255,255,255,0.18)',
        'text-primary': '#FFFFFF', 'text-secondary': '#B3B3B3', 'text-muted': '#7A7A7A',
        'success': '#F5F5F5', 'danger': '#4D4D4D', 'warning': '#999999',
        'overlay-soft': 'rgba(255,255,255,0.02)', 'overlay-mid': 'rgba(255,255,255,0.05)', 'overlay-strong': 'rgba(255,255,255,0.09)',
        'modal-bg-1': 'rgba(10,10,10,0.95)', 'modal-bg-2': 'rgba(0,0,0,0.97)', 'modal-backdrop': 'rgba(0,0,0,0.7)'
      }
    },
    {
      id: 'neumorphism', name: 'White/Gray Neumorphism', icon: 'fa-shapes', dark: false, structural: 'theme-structural-neumorphism',
      swatch: ['#E0E5EC', '#6C63FF', '#33383F'],
      vars: {
        'accent-1': '#6C63FF', 'accent-2': '#4F46E5', 'accent-3': '#8B5CF6',
        'bg-base': '#E0E5EC', 'bg-base-2': '#E0E5EC', 'bg-base-3': '#E0E5EC',
        'glass-bg': '#E0E5EC', 'glass-bg-strong': '#E6EBF1', 'glass-border': 'rgba(163,177,198,0.35)',
        'text-primary': '#33383F', 'text-secondary': '#5C6370', 'text-muted': '#8992A1',
        'success': '#4CAF7D', 'danger': '#E0654F', 'warning': '#E0A64F',
        'overlay-soft': 'rgba(163,177,198,0.08)', 'overlay-mid': 'rgba(163,177,198,0.14)', 'overlay-strong': 'rgba(163,177,198,0.22)',
        'modal-bg-1': 'rgba(224,229,236,0.98)', 'modal-bg-2': 'rgba(224,229,236,0.99)', 'modal-backdrop': 'rgba(51,56,63,0.35)'
      }
    }
  ];

  var DEFAULT_THEME_ID = 'neumorphism';

  function getThemeById(id) {
    for (var i = 0; i < THEME_LIST.length; i++) {
      if (THEME_LIST[i].id === id) return THEME_LIST[i];
    }
    return null;
  }

  function getStoredThemeId() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeThemeId(id) {
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — theme still
         applies for this session, it just won't persist. */
    }
  }

  var STRUCTURAL_CLASSES = ['theme-structural-glass', 'theme-structural-neumorphism'];

  function applyTheme(id, root) {
    var theme = getThemeById(id) || getThemeById(DEFAULT_THEME_ID);
    var el = root || document.documentElement;

    var vars = theme.vars;
    for (var key in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        el.style.setProperty('--' + key, vars[key]);
      }
    }

    el.setAttribute('data-theme', theme.id);
    el.style.colorScheme = theme.dark ? 'dark' : 'light';

    for (var i = 0; i < STRUCTURAL_CLASSES.length; i++) {
      el.classList.remove(STRUCTURAL_CLASSES[i]);
    }
    if (theme.structural) {
      el.classList.add(theme.structural);
    }

    return theme;
  }

  /* Apply immediately, synchronously, before the rest of the page
     (and style.css) finishes rendering — this is what prevents the
     flash-of-unstyled-content when the user has a saved theme. */
  var initialId = getStoredThemeId() || DEFAULT_THEME_ID;
  applyTheme(initialId);

  window.ThemeManager = {
    list: THEME_LIST,
    defaultId: DEFAULT_THEME_ID,
    getThemeById: getThemeById,
    getCurrentId: function () {
      return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME_ID;
    },
    setTheme: function (id) {
      var theme = applyTheme(id);
      storeThemeId(theme.id);
      return theme;
    }
  };
})();
