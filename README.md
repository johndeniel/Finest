# Shopify Theme Kit Development

Dive into the cutting-edge world of Shopify theme customization with this repository, offering a unique blend of innovative files, resources, and configurations. Explore new possibilities and push the boundaries of Shopify theme development on the **Ubuntu** platform, all powered by the versatile Theme Kit tool.


## Run Scripts
To start the development environment, use either of the following commands:

- Using Shopify CLI :
```bash
shopify theme dev

```

- Using Shopify Theme Kit:
```bash
theme watch --allow-live

```


## Prerequisite

- [x] [Shopify Account](https://www.shopify.com) for building and managing online stores
- [x] [Shopify Partners](https://www.shopify.com/partners) providing tools and resources for customizing Shopify themes.
- [x] [Theme Access](https://apps.shopify.com/theme-access?search_id=0a12c1ca-199a-4a6c-a3e7-6e83874e2d01&surface_detail=theme+kit+access&surface_inter_position=1&surface_intra_position=5&surface_type=search) for customizing and managing Shopify themes

- [x] Use this script to setup Shopify CLI is a command-line interface:

    ```bash
    sudo apt update && sudo apt upgrade
    
    sudo apt install curl gcc g++ make
    
    sudo apt install ruby-full
    
    sudo apt install ruby-dev
    # Ruby development environment
    
    sudo gem install bundler
    
    sudo apt install nodejs npm
    
    npm install -g @shopify/cli

    ```

- [x] Use this script to automatically install the latest Theme Kit version:

    ```bash
    curl -s https://shopify.dev/themekit.py | sudo python3

    ```
    
---
Remember to follow these steps carefully to ensure a seamless integration of your Shopify store with various Shopify services and tools
