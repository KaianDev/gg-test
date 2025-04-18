export const commands = [
	{
		id: 1,
		name: 'Buscar',
		description: 'Buscar por um jogo',
		concat: true,
		or: false,
		keys: ['ctrl', 'k']
	},
	{
		id: 2,
		name: 'Navegar',
		description: 'Navegar entre os itens',
		concat: false,
		or: false,
		keys: ['&uparrow;', '&downarrow;', '&leftarrow;', '&rightarrow;']
	},
	{
		id: 3,
		name: 'Selecionar',
		description: 'Selecionar um item',
		concat: false,
		or: true,
		keys: ['enter']
	}
];
