/**
 * The house menu, transcribed from the restaurant's own printed menu.
 *
 * ⚠️  PRICES NEED CLIENT CONFIRMATION BEFORE LAUNCH.
 * The source menu is from the kuna→euro transition era (it printed both
 * "96 kn / 12,74 EUR"). The euro figures below are the house's own published
 * numbers, but they are almost certainly out of date. Flagged in handoff.
 *
 * Dietary tags: only applied where the listed ingredients make it certain.
 * Gluten-free is deliberately NOT tagged — that needs the kitchen's word, not
 * an inference from an ingredient list.
 */

export type DietTag = "veg" | "spicy";

export type MenuItem = {
  name: string;
  description?: string;
  /** Euro, comma decimal, as printed. */
  price: string;
  tags?: DietTag[];
};

export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

/** The four service windows the house actually runs. */
export const SERVICES = [
  {
    name: "Breakfast",
    window: "08:00 — 11:00",
    note: "Eggs, muesli, warm bread, proper coffee.",
  },
  {
    name: "Brunch",
    window: "11:00 — 14:00",
    note: "The long middle of the day.",
  },
  {
    name: "Bistro 49",
    window: "11:00 — 23:00",
    note: "The full à la carte menu below.",
  },
  {
    name: "Bistronomy 49",
    window: "18:00 — 23:00",
    note: "The evening register — Classics and Adriatic plates.",
  },
] as const;

export const MENU: MenuSection[] = [
  {
    id: "bruschetta",
    title: "Bruschetta",
    items: [
      {
        name: "Bruschetta Mediterranea",
        description: "Prawns and capers",
        price: "7,83",
      },
      {
        name: "Bruschetta Continental",
        description: "Bacon, smoked cheese and zucchini julienne",
        price: "5,57",
      },
    ],
  },
  {
    id: "pasta",
    title: "Pasta, Risotto & Gnocchi",
    items: [
      {
        name: "Smoked Duck Pasta Penne",
        price: "12,74",
      },
      {
        name: "Prawn Tagliatelle",
        description:
          "Fresh tagliatelle, prawns, tomato and Mediterranean herb salsa",
        price: "13,01",
      },
      {
        name: "Truffle & Champignon Risotto",
        price: "13,01",
        tags: ["veg"],
      },
      {
        name: "Veal Risotto",
        description: "Veal, tomato sauce, parmigiano, arborio rice",
        price: "10,35",
      },
      {
        name: "Beef & Quattro Formaggi Pasta",
        description:
          "Beef strips, grana padano, gorgonzola, parmigiano, mozzarella, cream",
        price: "15,26",
      },
      {
        name: "Pork Rods & Gnocchi",
        description: "Strips in mushroom sauce and asparagus pesto",
        price: "11,55",
      },
      {
        name: "Makaruli",
        description: "Penne, the house way",
        price: "10,35",
      },
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    note: "Wood-fired. The crust is the reason people come back.",
    items: [
      {
        name: "Margarita",
        description: "Tomato sauce, cheese, olives, oregano",
        price: "5,57",
        tags: ["veg"],
      },
      {
        name: "Capricciosa",
        description: "Ham, cheese, tomato sauce, mushrooms, olives, oregano",
        price: "6,11",
      },
      {
        name: "Bianca",
        description: "No tomato — cheese and oregano",
        price: "7,17",
        tags: ["veg"],
      },
      {
        name: "Quattro Formaggi",
        description:
          "Gouda, mozzarella, gorgonzola, parmigiano, tomato sauce, olives, oregano",
        price: "7,30",
        tags: ["veg"],
      },
      {
        name: "Al Tonno",
        description: "Tuna, cheese, tomato sauce, onion, olives, oregano",
        price: "7,17",
      },
      {
        name: "Peperoncino",
        description:
          "Pepperoni, bacon, cheese, tomato sauce, mushrooms, olives, oregano",
        price: "7,30",
      },
      {
        name: "Bresaola",
        description:
          "Bresaola of pork neck, cheese, ketchup, Greek yoghurt, olives, oregano",
        price: "7,83",
      },
      {
        name: "Slavonia",
        description:
          "Spicy sausage, bacon, cheese, kajmak cream, tomato sauce, onion, olives, oregano",
        price: "7,57",
        tags: ["spicy"],
      },
      {
        name: "Siciliana",
        description:
          "Anchovies, capers, cheese, tomato sauce, onion, olives, oregano",
        price: "7,83",
      },
      {
        name: "Mexicana",
        description:
          "Bacon, cheese, corn, beans, chilli peppers, tomato sauce, olives, oregano",
        price: "7,83",
        tags: ["spicy"],
      },
      {
        name: "Pizza B49",
        description:
          "Bacon, prosciutto, mozzarella, tomato sauce, rocket, cherry tomato, oregano",
        price: "7,83",
      },
      {
        name: "Pizza Beef",
        description:
          "Beefsteak, cheese, tomato, rocket salad, grana padano, olives, oregano",
        price: "11,15",
      },
    ],
  },
  {
    id: "burgers",
    title: "Burgers",
    note: "Cooked medium rare. Ask for well done.",
    items: [
      {
        name: "Fran Burger",
        description: "Beef burger, mayonnaise",
        price: "6,50",
      },
      {
        name: "Chicken Burger",
        description: "Chicken breast, ketchup",
        price: "6,50",
      },
      {
        name: "Burger B49",
        description:
          "100% beef, bacon, smoked cheese, tomato, mayonnaise, onion jam",
        price: "7,83",
      },
      {
        name: "De Luxe Burger",
        description: "100% beef, cheese, egg, bacon, house sauce",
        price: "8,76",
      },
      {
        name: "Smoky BBQ Burger",
        description:
          "100% beef, smoked cheese, onion marmalade and chips, BBQ sauce",
        price: "8,76",
      },
      {
        name: "Cheese Bomb",
        description: "Tomato, onion chips, smoked cheese, mozzarella",
        price: "9,29",
      },
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwiches",
    items: [
      { name: "Smoked Ham & Cheese Sandwich", price: "6,50" },
      { name: "West Prawn Sandwich", price: "11,28" },
      { name: "Beef & Truffle Sandwich", price: "13,01" },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    items: [
      {
        name: "House Seasonal Salad",
        description: "Assorted greens, tomatoes, cucumber, red onion",
        price: "5,97",
        tags: ["veg"],
      },
      {
        name: "Greek Salad",
        description:
          "Feta, tomatoes, cucumber, paprika, olives, red onion",
        price: "8,63",
        tags: ["veg"],
      },
      { name: "Not Caesar Salad", price: "7,96" },
      {
        name: "Adriatic Prawn Salad",
        description: "House dressing, olive oil",
        price: "10,62",
      },
    ],
  },
  {
    id: "classics",
    title: "Classics",
    note: "The evening register. Bistronomy 49 from 18:00.",
    items: [
      {
        name: "Chicken Couscous",
        description: "Boneless chicken, couscous",
        price: "12,61",
      },
      {
        name: "BBQ Pork Belly",
        description: "Roasted pork belly with BBQ sauce, french fries and salad",
        price: "16,99",
      },
      {
        name: "Smoked Duck Breast",
        description: "Sautéed vegetables, carrot cream",
        price: "18,85",
      },
      {
        name: "Rumpsteak & Hummus",
        description: "250 g rumpsteak, hummus, fennel and seasonal salad",
        price: "21,24",
      },
      {
        name: "Beef Tagliata",
        description:
          "180 g sliced beefsteak, seasonal salad, pistachio pesto, aged balsamic, fresh cheese and demi-glace",
        price: "21,90",
      },
      {
        name: "Slow Cooked Beef Cheeks",
        description:
          "Cream polenta, pancetta, onion chips and demi-glace",
        price: "21,90",
      },
      {
        name: "Beefsteak & Bulgur",
        description: "220 g beefsteak, bulgur and julienne vegetables",
        price: "25,88",
      },
      {
        name: "Meat Platter De Luxe, for two",
        description:
          "Beefsteak, rumpsteak, shish kebab, chicken, ćevapi, smoked sausage, pork belly, french fries, grilled vegetables, ajvar and onion",
        price: "33,18",
      },
    ],
  },
  {
    id: "wok",
    title: "Wok",
    note: "Glass rice noodles instead of egg noodles on request, small surcharge.",
    items: [
      {
        name: "Teriyaki Chicken",
        description: "Chicken, noodles, julienne vegetables, teriyaki sauce",
        price: "9,56",
      },
      {
        name: "Curry Chicken",
        description: "Vegetables, curry and coconut milk",
        price: "9,56",
      },
      {
        name: "Sweet & Chilly Chicken",
        description:
          "Chicken, couscous, julienne vegetables, pistachio pesto, turmeric, sweet chilli sauce",
        price: "10,49",
        tags: ["spicy"],
      },
      {
        name: "Prawns Stir Fry",
        description:
          "Prawns, jasmine rice, julienne vegetables, soy and sweet chilli sauce",
        price: "11,28",
        tags: ["spicy"],
      },
      {
        name: "Spring Rolls",
        description: "With salad and sweet chilli dressing",
        price: "11,28",
      },
      {
        name: "Tofu Stir Fry",
        description: "Tofu, noodles, pistachio",
        price: "12,21",
        tags: ["veg"],
      },
      {
        name: "Teriyaki Beef",
        description:
          "Beefsteak strips, noodles, julienne vegetables, teriyaki sauce",
        price: "12,61",
      },
    ],
  },
  {
    id: "simple",
    title: "Simple & For The Little Ones",
    items: [
      {
        name: "Pennette Napolitana",
        price: "8,49",
        tags: ["veg"],
      },
      {
        name: "Chicken and Chips",
        description: "Grilled chicken, french fries",
        price: "8,49",
      },
      {
        name: "Spaghetti Parmigiano and Chicken",
        price: "9,95",
      },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      { name: "French fries", price: "—" },
      { name: "Grilled vegetables", price: "—" },
      { name: "Pancetta", price: "—" },
      { name: "Cheese", price: "—" },
      { name: "Olives", price: "—" },
      { name: "Mayonnaise", price: "—" },
      { name: "Ketchup", price: "—" },
      { name: "Butter", price: "—" },
    ],
  },
  {
    id: "desserts",
    title: "Pancakes & Desserts",
    items: [
      {
        name: "Cake of the Day",
        price: "3,98",
      },
      {
        name: "Chocolate Lava Cake",
        price: "4,65",
      },
      {
        name: "Raffaello Pancake",
        description: "Chocolate crumbs, strawberry topping",
        price: "5,97",
      },
      {
        name: "Nutella Banana Lješnjak Pancake",
        description: "Nutella, banana, hazelnut",
        price: "5,97",
      },
      {
        name: "Make It Your Way Pancake",
        description:
          "Nutella, Ferrero Rocher, forest fruit, Oreo and cookie crumbs, chocolate topping",
        price: "6,50",
      },
    ],
  },
];
