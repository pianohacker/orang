import { schema } from 'normalizr';

export const item = new schema.Entity( 'items' );
export const itemArray = new schema.Array( item );

export const bin = new schema.Entity( 'bins', {
	items: itemArray,
} );
export const binArray = new schema.Array( bin );

export const location = new schema.Entity( 'locations', {
	bins: binArray,
} );
export const locationArray = new schema.Array( location );

export const state = { locations: locationArray };
