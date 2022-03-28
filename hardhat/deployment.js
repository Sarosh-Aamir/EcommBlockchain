const hre = require('hardhat');
const ethers = require('@nomiclabs/hardhat-ethers');


const Contracts = {
    Ecomm: {
        name: "Ecomm",
        libraries: {
            // Helpers: "Helpers",
            // Product: "Product",
            Seller: "Seller",
        }
    }
}

const main = async () => {

    let contractKeys = Object.keys(Contracts)
    for (const contractKey of contractKeys) {
        let contractLibLinkedObj = {};
        let libraries = Contracts[contractKey].libraries;
        let libraryKeys = Object.keys(libraries);
        for (const libKey of libraryKeys) {
            let contractLibFactory = await hre.ethers.getContractFactory(libKey);
            let contractLib = await contractLibFactory.deploy();
            await contractLib.deployed();
            contractLibLinkedObj[libKey] = contractLib.address;
        }
        console.log(contractLibLinkedObj)
        const contractFactory = await hre.ethers.getContractFactory(Contracts[contractKey].name, {
            libraries: contractLibLinkedObj
        });
        const contractDeployment = await contractFactory.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
        await contractDeployment.deployed();
        console.log(contractDeployment.address);

    }


}


main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(0);
    })