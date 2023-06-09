# Cool Courier Service - Everest

A Node.js CLI courier service tool that allows users

- To calculate delivery cost estimation with discount offer.
- To calculate estimated delivery time.

---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environment.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.14.1

    $ npm --version
    8.5.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/Purifiedhuman/Everest.git
    $ cd PROJECT_TITLE
    $ npm install

## Configure app

None for now

---

## Running the project

    $ npm run dev:calculate-delivery-cost
    $ npm run dev:calculate-delivery-time

## Running the Tests

    $ npm run test
    $ npm run test:ui (with Vitest UI)

## Linting

    $ npm run lint
