//@ts-ignore
import { connect, createDataItemSigner } from '@permaweb/aoconnect/browser';
import { hb_url, scheduler } from '../utils/constants';

const useAoconnect = () => {
    const ao = connect(
        { 
            MODE: "mainnet", 
            SCHEDULER: scheduler,
            URL: hb_url,
            signer:createDataItemSigner(window.arweaveWallet)
        }
    )

    return {ao}
}

export default useAoconnect
