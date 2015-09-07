const actions = {
};

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
	]
};

export function coreReducer(state = DEFAULT_STATE, action) {
	switch (action.type) {
		default: return state;
	}
}
