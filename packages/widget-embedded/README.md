# LI.FI Widget NFT Checkout

The demo of the LI.FI Widget NFT Checkout based on the OpenSea API.

### How to run?

```
yarn dev
```

### How to test?

1. Find an NFT on the [OpenSea](https://opensea.io/). Please make sure it has an active listing and the test wallet has enough tokens to buy it. While we will be able to pay with any token in the process, the OpenSea SDK checks for the token in which the NFT is listed to generate transaction data.
2. Let's say we found this NFT https://opensea.io/assets/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578
3. We need to replace the `opensea.io/assets` part with `localhost:3000` or `widget.li.fi`, depending on the testing environment, so the final URL should look like this
http://localhost:3000/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578 or this https://widget.li.fi/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578
4. Open the URL and make sure the test wallet is switched to the chain the NFT is on so OpenSea SDK can generate transaction data.
5. Select any token on any chain and pay for NFT.

### Live Demo

https://github.com/lifinance/widget/assets/18644653/af360181-3856-4276-b309-f923f476f40b

#### Demo Transactions

https://optimistic.etherscan.io/tx/0xa9f4e4304822cfe01808555b66e047761361c9e54b2387f93e23e9ffb92ba151
https://polygonscan.com/tx/0x370682cbbc544e0ea258da774220b529a086c4b22941b924587cd2e0105579f6

### What does it look like?

<img src="https://github.com/lifinance/widget/assets/18644653/636c3071-c47e-45db-9ebd-1b7f502c2bab" width="400" />

### Questions?

Please don't hesitate to open an issue or contact us if you have any questions.
