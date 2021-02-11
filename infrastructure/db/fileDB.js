const fs = require('fs').promises;
const path = require('path');
const { jsonParser } = require('../../lib/helpers')

const baseDir = path.join(__dirname, '../../.data');

module.exports = {
	/** crates a doc in a collection (folder) */
	async create(collection, doc, data) {
		const filePath = path.resolve(baseDir, collection, doc + '.json');
		try {
			const filehandle = await fs.open(filePath, 'wx');
			data = JSON.stringify(data);
			await fs.writeFile(filehandle, data)
			await filehandle.close()
			return data
		} catch (error) {
			filehandle.close()
			return null
		}
	},

	/** Reads file contents */
	async read(collection, doc) {
		const filePath = path.resolve(baseDir, collection, doc + '.json');
		try {
			const data = await fs.readFile(filePath, 'utf8');
			return jsonParser(data)
		} catch (err) {
			return null
		}
	},

	/** Update file  */
	async update(collection, doc, data) {
		try {
			const filePath = path.resolve(baseDir, collection, doc + '.json');
			// open file for updating
			const filehandle = await fs.open(filePath, 'r+')
			await fs.truncate(filePath)
			await fs.writeFile(filehandle, JSON.stringify(data))
			await filehandle.close()
			return data

		} catch (err) {
			return null
		}

	},

	async delete(collection, doc) {
		const filePath = path.resolve(baseDir, collection, doc + '.json');
		try {
			await fs.unlink(filePath)
			return true
		} catch (error) {
			return null
		}
	}
};
