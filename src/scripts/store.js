import {writable} from 'svelte/store';
import {ROLES} from "./consts.js";

export const vault = writable({});
export const activeNetwork = writable({});
export const data = writable({});
export const roles = writable(ROLES)
export const account = writable("0xc0D477556c25C9d67E1f57245C7453DA776B51cf")
export const tokens = writable([])
export const ethersData = writable([])
export const auditHistory = writable({})
export const fileHash = writable("")
export const fileDropped = writable(File)
export const uploadBtnLoading = writable(false)
export const selectedReceipt = writable({})
