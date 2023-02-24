<script>
    import "../app.css";
    import networks from "../scripts/networksConfig.js";
    import {account, activeNetwork} from "../scripts/store.js";
    import {formatAddress} from "../scripts/helpers.js";
    import Select from "../components/Select.svelte";
    import {icons} from "../scripts/assets.js";
    import {ethers} from "ethers";
    import Navigation from "../components/Navigation.svelte";

    activeNetwork.set(networks[3])
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

    async function handleNetworkSelect(event) {
        // let activeNet = event.detail.selected
        // let chainId = ethers.utils.hexValue(activeNet.chainId)
        // try {
        //     await window.ethereum.request({
        //         method: "wallet_switchEthereumChain",
        //         params: [{chainId}]
        //     });
        //
        // } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // if (switchError.code === 4902) {
        //     try {
        //         await window.ethereum.request({
        //             method: "wallet_addEthereumChain",
        //             params: [
        //                 {
        //                     chainId: chainId,
        //                     chainName: activeNet.displayName,
        //                     rpcUrls: [activeNet.rpcUrl],
        //                     blockExplorerUrls: [activeNet.blockExplorer],
        //                     nativeCurrency: {
        //                         name: activeNet.currencySymbol,
        //                         symbol: activeNet.currencySymbol,
        //                         decimals: 18
        //                     }
        //                 }
        //             ]
        //         });
        //     } catch (addError) {
        // handle "add" error
        // }
        // }
        // handle other "switch" errors
        // }
        // await networkChanged()
    }
</script>
<div>
  <div class="header flex w-full h-14 justify-end">
    <div class="flex pr-20 text-white items-center font-bold">
      <div class="pr-16">
        <Select options="{networks}" on:select={handleNetworkSelect} label={$activeNetwork.displayName}>
          <div slot="icon">
            <img class="pr-3" src={icons[$activeNetwork.icon]} alt={$activeNetwork?.displayName}/>
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


