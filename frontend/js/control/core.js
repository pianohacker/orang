import u from 'updeep';

const DEFAULT_STATE = {
	locations: [
		{
			id: 1,
			name: 'Hex',
			bins: [
				[],
				[],
				[
					{ name: 'Measuring Tape' },
				],
				[],
			],
		},
		{
			id: 2,
			name: 'Cables',
			bins: [
				[
					{ name: 'Micro USB Cables' },
				],
				[],
				[
					{ name: 'HDMI Cables' },
				],
				[],
			],
		}
	],
	search: '',
};

export function coreReducer(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case 'setSearch':
			return u({ search: action.search }, state);
		default: return state;
	}
}
