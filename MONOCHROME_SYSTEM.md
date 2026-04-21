# Système de Couleurs Monochrome ExamGuard

## Palette Stricte (Noir, Blanc, Gris uniquement)

### Noir et Blanc
- **Noir pur**: `#000000` - Texte principal, icônes, boutons primaires
- **Blanc pur**: `#FFFFFF` - Backgrounds principaux, texte sur fond noir

### Nuances de Gris (du plus foncé au plus clair)

#### Gris Très Foncés (proche du noir)
- **Gray 950**: `#0A0A0A` - Alternative au noir pur
- **Gray 900**: `#111111` - Backgrounds sombres, headers
- **Gray 850**: `#1A1A1A` - Cards sur fond sombre
- **Gray 800**: `#222222` - Hover states sur fond sombre

#### Gris Foncés
- **Gray 700**: `#333333` - Texte secondaire
- **Gray 600**: `#444444` - Borders, séparateurs
- **Gray 500**: `#666666` - Texte tertiaire, labels

#### Gris Moyens
- **Gray 400**: `#888888` - Placeholder text
- **Gray 300**: `#999999` - Disabled states
- **Gray 200**: `#AAAAAA` - Borders subtiles

#### Gris Clairs
- **Gray 150**: `#CCCCCC` - Borders très subtiles
- **Gray 100**: `#DDDDDD` - Hover backgrounds (clair)
- **Gray 75**: `#E5E5E5` - Séparateurs légers
- **Gray 50**: `#EAEAEA` - Backgrounds secondaires
- **Gray 25**: `#F5F5F5` - Backgrounds très clairs

## Mappages par Élément

### Backgrounds
- **Principal**: `#FFFFFF` (blanc pur)
- **Secondaire**: `#F5F5F5` (gray-25)
- **Cards**: `#FFFFFF` avec border `#E5E5E5`
- **Hover cards**: `#FAFAFA` ou `#F5F5F5`
- **Headers**: `#FFFFFF` avec border `#E5E5E5`

### Texte
- **Principal**: `#000000` (noir pur)
- **Secondaire**: `#333333` (gray-700)
- **Tertiaire**: `#666666` (gray-500)
- **Désactivé**: `#999999` (gray-300)
- **Placeholder**: `#888888` (gray-400)

### Boutons

#### Bouton Primaire
- **Background**: `#000000` (noir)
- **Text**: `#FFFFFF` (blanc)
- **Hover**: `#222222` (gray-800)
- **Active**: `#111111` (gray-900)

#### Bouton Secondaire
- **Background**: `#FFFFFF` (blanc)
- **Border**: `#000000` (noir) ou `#222222` (gray-800)
- **Text**: `#000000` (noir)
- **Hover**: `#F5F5F5` (gray-25)

#### Bouton Ghost/Tertiaire
- **Background**: transparent
- **Text**: `#333333` (gray-700)
- **Hover background**: `#F5F5F5` (gray-25)

### Borders & Dividers
- **Principal**: `#E5E5E5` (gray-75)
- **Secondaire**: `#EAEAEA` (gray-50)
- **Fort (emphasis)**: `#CCCCCC` (gray-150)
- **Focus**: `#000000` (noir) 2px

### Shadows
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.06)`
- **Normale**: `0 2px 8px rgba(0, 0, 0, 0.08)`
- **Forte**: `0 4px 16px rgba(0, 0, 0, 0.12)`
- **Modal**: `0 8px 32px rgba(0, 0, 0, 0.16)`

### États Spéciaux (SANS couleur)

#### Success (remplace vert)
- **Icon/Text**: `#000000` (noir)
- **Background**: `#F5F5F5` (gray-25)
- **Border**: `#CCCCCC` (gray-150)
- **Indicateur**: utiliser ✓ icon en noir

#### Error (remplace rouge)
- **Icon/Text**: `#000000` (noir)
- **Background**: `#EAEAEA` (gray-50)
- **Border**: `#999999` (gray-300)
- **Indicateur**: utiliser ✗ icon en noir ou border plus épais

#### Warning (remplace orange/amber)
- **Icon/Text**: `#333333` (gray-700)
- **Background**: `#F5F5F5` (gray-25)
- **Border**: `#AAAAAA` (gray-200)
- **Indicateur**: utiliser ⚠ icon en noir

#### Info
- **Icon/Text**: `#333333` (gray-700)
- **Background**: `#FAFAFA`
- **Border**: `#E5E5E5` (gray-75)

### Focus & Active States
- **Focus ring**: `0 0 0 2px #000000`
- **Active**: background `#EAEAEA` (gray-50)
- **Selected**: border `#000000` 2px, background `#F5F5F5`

### Icons
- **Principal**: `#000000` (noir)
- **Secondaire**: `#333333` (gray-700)
- **Tertiaire**: `#666666` (gray-500)
- **Désactivé**: `#CCCCCC` (gray-150)

## Exemples d'Application

### Bouton Primaire
```tsx
<button className="bg-black text-white hover:bg-[#222222] px-6 py-3 rounded-lg transition-colors shadow-sm">
  Action
</button>
```

### Bouton Secondaire
```tsx
<button className="bg-white border-2 border-black text-black hover:bg-[#F5F5F5] px-6 py-3 rounded-lg transition-colors">
  Cancel
</button>
```

### Card
```tsx
<div className="bg-white border border-[#E5E5E5] rounded-xl shadow-sm hover:shadow-md transition-shadow">
  <div className="p-6">
    <h3 className="text-black text-lg mb-2">Title</h3>
    <p className="text-[#666666] text-sm">Description</p>
  </div>
</div>
```

### Input
```tsx
<input 
  className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
  placeholder="Enter text..."
/>
```

### Badge/Pill (remplace les badges colorés)
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[#333333] text-xs">
  Badge
</span>
```

## Règles de Hiérarchie Visuelle (sans couleur)

1. **Taille et poids de police** - utiliser bold, semi-bold, regular pour créer la hiérarchie
2. **Espacement** - plus d'espace autour des éléments importants
3. **Contraste** - noir pur pour les éléments principaux, gris pour secondaire
4. **Borders** - épaisseur (1px vs 2px) pour l'emphase
5. **Shadows** - plus prononcées pour les éléments élevés
6. **Taille** - éléments plus grands = plus importants

## Transitions & Animations
- Toutes les transitions doivent être subtiles
- Utiliser opacity, transform, shadow
- Durée: 150-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Accessibilité
- Contraste minimum 7:1 pour le texte principal (noir sur blanc = 21:1) ✓
- Contraste 4.5:1 pour le texte secondaire (#333 sur blanc = 12.6:1) ✓
- Ne PAS utiliser uniquement la couleur pour transmettre l'information
- Utiliser icônes, texte, patterns pour différencier les états
