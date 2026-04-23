import type { Question } from "@/shared/types/exam";

export const mockExamQuestions: Question[] = [
  {
    id: 1,
    type: "mcq",
    text: "Quel principe garantit la compatibilite des modules lors d'un examen securise en Java? Choisissez la reponse la plus precise.",
    points: 2,
    options: [
      { id: "A", text: "Le principe d'encapsulation garantit l'isolation des modules" },
      { id: "B", text: "La JVM assure la portabilite via le bytecode independant de la plateforme" },
      { id: "C", text: "Les interfaces definissent des contrats stricts entre modules" },
      { id: "D", text: "Le garbage collector gere la compatibilite memoire" },
    ],
  },
  {
    id: 2,
    type: "mcq",
    text: "Quelle est la difference fondamentale entre une ArrayList et une LinkedList en Java?",
    points: 2,
    options: [
      { id: "A", text: "ArrayList utilise un tableau dynamique, acces O(1) indexe" },
      { id: "B", text: "LinkedList utilise des noeuds doublement chaines, insertion O(1)" },
      { id: "C", text: "Les deux ont la meme complexite temporelle pour toutes les operations" },
      { id: "D", text: "ArrayList est synchronisee contrairement a LinkedList" },
    ],
  },
  {
    id: 3,
    type: "text",
    text: "Expliquez le concept de polymorphisme en programmation orientee objet. Donnez un exemple concret en Java et decrivez comment il ameliore la maintenabilite du code.",
    points: 5,
    placeholder: "Redigez votre reponse ici. Soyez precis et illustrez avec des exemples...",
    minWords: 80,
  },
  {
    id: 4,
    type: "code",
    text: "Ecrivez une fonction Java qui prend un tableau d'entiers en entree et retourne le second plus grand element. Gerez les cas limites (tableau vide, tous les elements identiques).",
    points: 8,
    language: "java",
    starterCode: `public class Solution {
    
    /**
     * Retourne le second plus grand element du tableau.
     * @param arr Le tableau d'entiers
     * @return Le second plus grand element, ou -1 si non trouve
     */
    public static int secondLargest(int[] arr) {
        // Votre code ici
        
    }
    
    public static void main(String[] args) {
        int[] test1 = {3, 1, 4, 1, 5, 9, 2, 6};
        System.out.println(secondLargest(test1)); // Attendu: 6
        
        int[] test2 = {1, 1, 1};
        System.out.println(secondLargest(test2)); // Attendu: -1
    }
}`,
  },
  {
    id: 5,
    type: "mcq",
    text: "Quel patron de conception permet de creer des objets sans specifier leur classe concrete tout en definissant une interface pour la creation?",
    points: 2,
    options: [
      { id: "A", text: "Singleton - une seule instance dans toute l'application" },
      { id: "B", text: "Factory Method - delegue la creation aux sous-classes" },
      { id: "C", text: "Observer - notifie les dependants d'un changement d'etat" },
      { id: "D", text: "Decorator - ajoute dynamiquement des responsabilites" },
    ],
  },
  {
    id: 6,
    type: "text",
    text: "Decrivez les differences entre les exceptions verifiees (checked) et non verifiees (unchecked) en Java. Quand faut-il utiliser chaque type?",
    points: 4,
    placeholder: "Expliquez avec des exemples de cas d'utilisation...",
    minWords: 50,
  },
  {
    id: 7,
    type: "code",
    text: "Implementez un algorithme de tri rapide (QuickSort) en Python. Votre implementation doit trier une liste en ordre croissant.",
    points: 10,
    language: "python",
    starterCode: `def quicksort(arr):
    """
    Implemente le tri rapide (QuickSort).
    
    Args:
        arr: Liste d'entiers a trier
    Returns:
        Liste triee en ordre croissant
    """
    # Votre code ici
    pass


# Tests
print(quicksort([3, 6, 8, 10, 1, 2, 1]))  # [1, 1, 2, 3, 6, 8, 10]
print(quicksort([]))                        # []
print(quicksort([1]))                       # [1]
`,
  },
  {
    id: 8,
    type: "mcq",
    text: "Quelle instruction SQL retourne exactement les doublons dans une colonne 'email' de la table 'users'?",
    points: 3,
    options: [
      { id: "A", text: "SELECT email FROM users WHERE COUNT(email) > 1" },
      { id: "B", text: "SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1" },
      { id: "C", text: "SELECT DISTINCT email FROM users WHERE email IS DUPLICATE" },
      { id: "D", text: "SELECT email, COUNT(*) FROM users HAVING COUNT(*) > 1" },
    ],
  },
];

export const TOTAL_QUESTIONS = mockExamQuestions.length;
