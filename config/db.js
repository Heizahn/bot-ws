const { DataSource } = require('typeorm');
require('dotenv').config();
const { EntitySchema } = require('typeorm');

const Invoice = new EntitySchema({
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

const db = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [Invoice],
	synchronize: true,
	logging: false,
});

module.exports = {
	db,
	Invoice,
};
