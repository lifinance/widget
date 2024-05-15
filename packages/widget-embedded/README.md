# LI.FI Widget NFT Checkout

The demo of the LI.FI Widget NFT Checkout based on the OpenSea API.

### How to run?

```
yarn dev
```

### How to test?

1) Find an NFT on the [OpenSea](https://opensea.io/). Please make sure it has an active listing and the test wallet has enough tokens to buy it. Later, we will be able to pay with any token, but in order to generate transaction data, OpenSea SDK checks for the token in which the NFT is listed.
2) Let's say we found this NFT
https://opensea.io/assets/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578
We need to replace the `opensea.io/assets` part with our localhost, so the final URL should look like this
http://localhost:3000/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578
3) Open the URL and make sure the test wallet is switched to the chain the NFT is on so OpenSea SDK can generate transaction data.
4) Select any token on any chain and pay for NFT.

### What does it look like?

<img src="https://github.com/lifinance/widget/assets/18644653/636c3071-c47e-45db-9ebd-1b7f502c2bab" width="400" />

### Questions?

Please don't hesitate to open an issue if you have any questions.
