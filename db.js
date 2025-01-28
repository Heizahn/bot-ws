require('dotenv').config();
const mongoose = require('mongoose');

// Esquema simplificado
const InvoiceSchema = new mongoose.Schema({
	referencia: {
		type: String,
		required: true,
		unique: true,
	},
});

// Función manual para obtener el próximo ID
InvoiceSchema.statics.getNextId = async function () {
	const lastInvoice = await this.findOne().sort({ id: -1 });
	return lastInvoice ? lastInvoice.id + 1 : 1;
};

const Invoice = mongoose.model('Invoice', InvoiceSchema);

// Conexión a MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MDB_URI);
		console.log('MongoDB conectado');
	} catch (error) {
		console.error('Error de conexión:', error.message);
		process.exit(1);
	}
};

module.exports = {
	Invoice,
	connectDB,
	mongoose,
};
