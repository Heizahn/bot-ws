import { EntitySchema } from 'typeorm';

export const Invoice = new EntitySchema({
	name: 'Invoice',
	columns: {
		id: {
			type: Number,
			primary: true,
			generated: true,
		},

		reference: {
			type: String,
			unique: true,
		},
	},
});
