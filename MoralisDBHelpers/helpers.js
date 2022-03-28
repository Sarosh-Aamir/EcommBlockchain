import {Moralis} from "moralis";

export const MoralisHelpers = {


    uploadJSONFile: async (name, jsonObject) => {
        const file = new Moralis.File(`${name}.json`, {base64: btoa(JSON.stringify(jsonObject))});
        await file.saveIPFS({useMasterKey: true});
        return file.ipfs();
    },
    uploadFile: async (name, fileToUpload) => {
        const file = new Moralis.File(`${name}.json`, fileToUpload);
        await file.saveIPFS({useMasterKey: true});
        return file.ipfs();
    },


    getJsonObjectFromFile: async (url) => {
        const resp = await fetch(url);
        return resp.json();

    }

}