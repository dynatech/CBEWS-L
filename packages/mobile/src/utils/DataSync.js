import AsyncStorage from '@react-native-community/async-storage';

const SiteCodes = {
	51: 'Marirong',
	50: 'Umingan'
}

const SyncKeys = {
	'Marirong': [
		'MarCapacityAndVulnerability',
		''
	],
	'Umingan': []
}

const DataSync = {
	getCachedData: async function (site_id) {
		const sync_keys = SyncKeys[SiteCodes[site_id]];
		return sync_keys;
	},
	compileUnsyncData: async function(keys) {

	},
	syncDataToCloud: async function () {

	},
	syncDataToServer: async function () {

	}
};

export default DataSync;
