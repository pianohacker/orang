import _ from 'lodash';
import { normalize } from 'normalizr';
import { createMigrate } from 'redux-persist'

import * as schema from './schema';

const migrations = {
	0: state => {
		let binId = 1;
		let itemId = 1;
		let locationId = 1;

		let locations = Array.isArray( state.locations ) ? state.locations :
			Array.isArray( state ) ? state :
				[];

		return {
			locations: locations.map( location => ( {
				...location,
				id: locationId++,
				bins: location.bins.map( bin => ( {
					id: binId++,
					items: bin.map( item => ( {
						...item,
						id: itemId++,
					} ) ),
				} ) ),
			} ) ),
		};
	},
	1: state => {
		let { entities } = normalize( state, schema.state );

		return entities;
	},
};

export const migrate = createMigrate( migrations, { debug: false } );

export const MIGRATE_VERSION = _( migrations ).keys().max();
