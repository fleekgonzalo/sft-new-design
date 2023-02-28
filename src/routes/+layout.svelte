<script>
    import "../app.css";
    import networks from "../scripts/networksConfig.js";
    import {account, activeNetwork, ethersData, tokens, vault} from "../scripts/store.js";
    import {formatAddress, getSubgraphData} from "../scripts/helpers.js";
    import Select from "../components/Select.svelte";
    import {icons} from "../scripts/assets.js";
    import {ethers} from "ethers";
    import Navigation from "../components/Navigation.svelte";
    import {onMount} from "svelte";

    activeNetwork.set(networks[3])
    let connectedAccount;
    let isMetamaskInstalled;

    let accountMenuOptions = [
        {
            id: "copy",
            displayName: "Copy Address",
            action: () => {
                if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText($account);
                }
                return Promise.reject("The Clipboard API is not available.");
            }
        },
        {
            id: "view",
            displayName: "View on Explorer",
            action: () => {
                window.open(`${$activeNetwork.blockExplorer}address/${$account}`);
            },
        }
    ]

    onMount(async () => {
        isMetamaskInstalled = typeof window.ethereum !== "undefined"

        await getEthersData()

        if (isMetamaskInstalled) {
            await setNetwork()
            connectedAccount = await getMetamaskConnectedAccount()

            if (connectedAccount) {
                account.set(connectedAccount)
                // navigateTo(location || '#', {replace: false})
            } else {
                localStorage.removeItem('account')
            }

            window.ethereum.on("accountsChanged", async (accounts) => {
                if (!accounts.length) {
                    account.set(null);
                    localStorage.removeItem('account')
                } else {
                    account.set(accounts[0]);
                    localStorage.setItem('account', $account)
                }
            });
            window.ethereum.on("chainChanged", networkChanged);
        }
        await getTokens()

        // const grantRoleTx = await $vault.connect($ethersData.signer).grantRole(await $vault.connect($ethersData.signer).DEPOSITOR(), $account.trim());
        // await grantRoleTx.wait()


    });

    async function handleNetworkSelect(event) {
        let activeNet = event.detail.selected
        let chainId = ethers.utils.hexValue(activeNet.chainId)

        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId}]
            });
        } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: chainId,
                            chainName: activeNet.displayName,
                            rpcUrls: [activeNet.rpcUrl],
                            blockExplorerUrls: [activeNet.blockExplorer],
                            nativeCurrency: {
                                name: activeNet.currencySymbol,
                                symbol: activeNet.currencySymbol,
                                decimals: 18
                            }
                        }
                    ]
                });
            } catch (addError) {
        // handle "add" error
        }
        }
        // handle other "switch" errors
        }
        await networkChanged()
    }

    async function networkChanged() {
        localStorage.setItem("vaultAddress", "")
        vault.set({})
        await setNetwork()
        await getTokens()
    }

    async function setNetwork() {
        let network = await $ethersData.provider.getNetwork();
        let connectedChainId = parseInt(network.chainId);
        let temp = networks.find(
            (network) => network.chainId === connectedChainId
        )
        activeNetwork.set(temp)
        return temp
    }
    async function getTokens() {
        let query = `
        query {
          offchainAssetReceiptVaults(orderBy:deployTimestamp orderDirection:desc){
            deployer,
            name,
            address,
            symbol
          }
        }`

        getSubgraphData($activeNetwork, {}, query, 'offchainAssetReceiptVaults').then((res) => {
            if ($activeNetwork) {
                let temp = res.data.offchainAssetReceiptVaults
                tokens.set(temp)
            }
        })
    }
    async function getEthersData() {
        if (window.ethereum) {
            let temp = {}
            temp.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            temp.signer = temp.provider.getSigner();
            temp.signerOrProvider = temp.signer ? temp.signer : temp.provider;
            ethersData.set(temp)
        }
    }

    async function getMetamaskConnectedAccount() {
        if (isMetamaskInstalled) {
            const accounts = await $ethersData.provider.listAccounts();
            console.log(accounts)
            return accounts.length > 0 ? accounts[0] : null;
        }
    }
</script>
<div>
  <div class="header flex w-full h-14 justify-end">
    <div class="flex pr-20 text-white items-center font-bold">
      <div class="pr-16">
        <Select options="{networks}" on:select={handleNetworkSelect} label={$activeNetwork?.displayName}>
          <div slot="icon">
            <img class="pr-3" src={icons[$activeNetwork?.icon]} alt={$activeNetwork?.displayName}/>
          </div>
        </Select>
      </div>
      <Select options={accountMenuOptions}
              label={formatAddress($account)}
              staticLabel={true}/>
    </div>
  </div>
  <div class="flex">
    <Navigation/>
    <div class="flex mx-5 w-full">
      <slot></slot>
    </div>
  </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap');

    .header {
        background: linear-gradient(90.04deg, #B5DCFF 2.46%, #6F5EA1 96.36%);
    }
</style>


