/**
 * Liste exhaustive des établissements de l'Université Mohammed Premier (UMP) d'Oujda.
 *
 * Utilisée notamment dans les formulaires d'inscription et de profil pour permettre
 * à l'utilisateur de sélectionner son école/faculté d'appartenance.
 *
 * Le type est figé via `as const` afin d'exposer un tuple en lecture seule, dont
 * chaque entrée peut servir de littéral de type (utile pour les validations Zod
 * ou les enums dérivés).
 */
export const umpSchools = [
  "École Nationale de l'Intelligence Artificielle et du Digital de Berkane (ENIAD)",
  "École Nationale des Sciences Appliquées d'Oujda (ENSAO)",
  "École Nationale de Commerce et de Gestion d'Oujda (ENCGO)",
  "École Supérieure de Technologie d'Oujda (ESTO)",
  "École Supérieure de Technologie de Nador (ESTN)",
  "École Supérieure de l'Éducation et de la Formation d'Oujda (ESEFO)",
  "Faculté de Médecine et de Pharmacie d'Oujda (FMPO)",
  "Faculté des Sciences d'Oujda (FSO)",
  "Faculté des Lettres et Sciences Humaines d'Oujda (FLSHO)",
  "Faculté des Sciences Juridiques, Économiques et Sociales d'Oujda (FSJESO)",
  "Faculté Pluridisciplinaire de Nador (FPN)",
] as const;
