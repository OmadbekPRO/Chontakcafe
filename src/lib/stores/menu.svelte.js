// src/lib/stores/menu.svelte.ts
let menuItems = $state([
	{
		id: '1',
		name: 'Classic Burger',
		description: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce',
		price: 1299,
		category: 'food',
		image: '/assets/burger.png'
	},
	{
		id: '2',
		name: 'Caesar Salad',
		description: 'Fresh romaine lettuce with parmesan, croutons, and creamy dressing',
		price: 899,
		category: 'food',
		image: '/assets/salad.png'
	},
	{
		id: '3',
		name: 'Margherita Pizza',
		description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
		price: 1499,
		category: 'food',
		image: '/assets/pizza.png'
	},
	{
		id: '4',
		name: 'Iced Latte',
		description: 'Smooth espresso with cold milk and ice',
		price: 499,
		category: 'drinks',
		image: '/assets/latte.png'
	},
	{
		id: '5',
		name: 'Fresh Orange Juice',
		description: 'Freshly squeezed orange juice',
		price: 399,
		category: 'drinks',
		image: '/assets/juice.png'
	},
	{
		id: '6',
		name: 'Chocolate Cake',
		description: 'Rich chocolate cake with smooth ganache',
		price: 699,
		category: 'desserts',
		image: '/assets/cake.png'
	}
]);

let categories = $state([
	{ id: 'food', label: 'Food' },
	{ id: 'drinks', label: 'Drinks' },
	{ id: 'desserts', label: 'Desserts' }
]);

export {menuItems, categories}