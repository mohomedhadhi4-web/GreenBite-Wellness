// Simple in-memory recipe dataset
const RECIPES = [
  {
    id: 'r1',
    title: 'Power Oat Breakfast Bowl',
    category: 'breakfast',
    img: 'images/r1.jpg',
    short: 'Warm oats with berries, nuts and a drizzle of honey.',
    ingredients: [
      '1 cup rolled oats',
      '1 1/2 cup milk (or plant milk)',
      'Handful mixed berries',
      '1 tbsp honey',
      '1 tbsp chopped walnuts'
    ],
    steps: [
      'Bring oats and milk to a simmer.',
      'Cook 5–7 minutes until creamy.',
      'Top with berries, honey, and walnuts.'
    ],
    nutrition: {calories:420, carbs:60, protein:12, fat:12}
  },
  {
    id: 'r2',
    title: 'Quinoa & Chickpea Salad',
    category: 'lunch',
    img: 'images/r2.jpg',
    short: 'Protein-rich salad with citrus dressing.',
    ingredients: [
      '1 cup cooked quinoa',
      '1 cup cooked chickpeas',
      '1/2 cup cherry tomatoes',
      'Handful parsley',
      'Dressing: olive oil, lemon, salt'
    ],
    steps: [
      'Combine quinoa, chickpeas, and veggies.',
      'Whisk dressing and toss.',
      'Serve chilled or room temp.'
    ],
    nutrition:{calories:550, carbs:64, protein:20, fat:18}
  },
  {
    id: 'r3',
    title: 'Grilled Salmon & Veggies',
    category: 'dinner',
    img: 'images/r3.jpg',
    short: 'Lean protein with seasonal vegetables.',
    ingredients: ['150g salmon fillet', 'Assorted vegetables', 'Olive oil', 'Salt & pepper'],
    steps: ['Season salmon and grill 4–6 min per side.', 'Roast or grill veggies.', 'Serve with lemon.'],
    nutrition: {calories:480, carbs:20, protein:42, fat:24}
  },
  {
    id: 'r4',
    title: 'Nutty Energy Bites',
    category: 'snack',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format&fit=crop',
    short: 'No-bake bites for quick energy.',
    ingredients: ['1 cup dates', '1/2 cup almonds', '2 tbsp cocoa powder', 'Pinch salt'],
    steps: ['Pulse dates and nuts', 'Form into balls', 'Chill and enjoy'],
    nutrition: {calories:120, carbs:16, protein:3, fat:6}
  }
];
