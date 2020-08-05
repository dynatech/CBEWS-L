import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import MobileCaching from './MobileCaching';
import { MarirongSync } from './SyncAPIs';

const SiteCodes = {
	51: 'Marirong',
	50: 'Umingan'
}

const SyncKeys = {
	'Marirong': [
		'MarCapacityAndVulnerability'
	],
	'Umingan': []
}

const DataSync = {
	getCachedData: async function (site_id) {
		const sync_keys = SyncKeys[SiteCodes[site_id]];
		return sync_keys;
	},
	compileUnsyncData: async function(keys, site) {
		let percent_counter = 0;
		keys.forEach(async (key)=> {
			let toSync = [];
			let cached = await MobileCaching.getItem(key);
			if (cached != null) {
				cached.forEach((data) => {
					let keyToSync = {
						'key': key,
						'data': {
							'add': [],
							'modify': [],
							'delete': []
						}
					}
	
					switch(data.alterations) {
						case 'add':
							keyToSync.data.add.push(data)
							break;
						case 'update':
							keyToSync.data.modify.push(data)
							break;
						case 'delete':
							keyToSync.data.delete.push(data)
							break;
						default:
							console.log("All data is updated");
							break;
					}
					toSync.push(keyToSync);
				});

				switch(site) {
					case 'Marirong':
						MarirongSync(toSync)
						break;
					default:
						break;
				}
			}
		});
	},
	syncDataToCloud: async function () {

	},
	syncDataToServer: async function () {

	},

};

export default DataSync;
