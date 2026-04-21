# Nouveau Système de Couleurs ExamGuard

## Palette Principale

### Couleurs d'Action (Primaire)
- **Indigo 500**: `#6366F1` - Boutons primaires, éléments actifs, liens
- **Indigo 600**: `#4F46E5` - États hover des boutons primaires
- **Indigo 400**: `#818CF8` - Variante plus claire pour icônes et highlights

### Couleurs d'Accent (Secondaire)
- **Violet 500**: `#8B5CF6` - Accents, badges, états spéciaux
- **Violet 600**: `#7C3AED` - États hover des accents
- **Violet 400**: `#A78BFA` - Variante plus claire

### Couleurs d'Highlight
- **Rose 500**: `#EC4899` - Notifications importantes, badges premium
- **Rose 600**: `#DB2777` - États hover
- **Rose 400**: `#F472B6` - Variante plus claire

## Couleurs Neutres (Inchangées)

### Backgrounds
- **Slate 900**: `#0F172A` - Background principal
- **Slate 800**: `#1E293B` - Cards, panels
- **Slate 700**: `#334155` - Borders, séparateurs

### Textes
- **Slate 100**: `#F1F5F9` - Texte primaire
- **Slate 200**: `#E2E8F0` - Texte secondaire important
- **Slate 300**: `#CBD5E1` - Texte secondaire
- **Slate 400**: `#94A3B8` - Texte tertiaire
- **Slate 500**: `#64748B` - Texte désactivé
- **Slate 600**: `#475569` - Texte placeholder

## Couleurs Fonctionnelles (Inchangées)

### Success
- **Green 400**: `#4ADE80`
- **Green 500**: `#22C55E`

### Error / Danger
- **Red 400**: `#F87171`
- **Red 500**: `#EF4444`
- **Rose 500**: `#F43F5E` - Pour alertes de fraude

### Warning
- **Amber 400**: `#FBBF24`
- **Amber 500**: `#F59E0B`

## Mappages de Remplacement

### Ancienne → Nouvelle Palette

| Ancien | Nouveau | Usage |
|--------|---------|-------|
| `blue-500` | `indigo-500` | Boutons primaires, éléments actifs |
| `blue-600` | `indigo-600` | Hover boutons primaires |
| `blue-400` | `indigo-400` | Icônes, highlights |
| `cyan-500` | `violet-500` | Accents, badges |
| `cyan-600` | `violet-600` | Hover accents |
| `cyan-400` | `violet-400` | Icônes accent |

### Gradients

**Primaire** (remplace `from-blue-600 to-cyan-600`):
```
from-indigo-600 to-violet-600
```

**Hover Primaire** (remplace `from-blue-500 to-cyan-500`):
```
from-indigo-500 to-violet-500
```

**Glow/Shadow** (remplace `shadow-blue-500/25`):
```
shadow-indigo-500/25
```

## Exemples d'Application

### Bouton Primaire
```tsx
<button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25">
  Action
</button>
```

### Badge Actif
```tsx
<span className="bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
  Actif
</span>
```

### Card avec Glow
```tsx
<div className="bg-[#1E293B] border border-[#334155]/50">
  <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/20 to-violet-500/15 blur-sm" />
  <!-- Contenu -->
</div>
```

## Hiérarchie Visuelle

1. **Actions primaires**: Indigo (gradients indigo→violet)
2. **Actions secondaires**: Violet (accents)
3. **Highlights spéciaux**: Rose (notifications)
4. **États de succès**: Green
5. **États d'erreur**: Red/Rose
6. **Alertes**: Amber
