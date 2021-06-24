# create-ol-app

The `create-ol-app` program sets up a project directory with the dependencies required for developing an OpenLayers application.  The program requires `npx`, distributed with [Node](https://nodejs.org/) (at least version 12).

Using `create-ol-app` saves you from having to set up or configure tools like webpack or Parcel.  After setting up a new OpenLayers application, you can proceed with configuring the development environment to your liking – the `create-ol-app` program sets up the required tools, but doesn't lock you in to any specific configuration.

## Creating a new application

To create a new OpenLayers application, choose a name for your application (`my-app` below) and run the following:

    npx create-ol-app my-app

This will create a new directory called `my-app` (choose a different name if you like) and install the dependencies for OpenLayers application development.  By default, [Parcel](https://www.npmjs.com/package/parcel) is used as a bundler.  See below for other options.

*💡 Tip – if you run `npx create-ol-app` with no additional arguments, the new application will be set up in the current directory.*

After the step above completes, you can change into your new application directory and start a development server:

    cd my-app
    npm start

See the `my-app/readme.md` for more detail on working with the new application.

### Choosing a bundler

The `create-ol-app` program supports a few different module bundlers.  By default, an application is set up using [Parcel](https://www.npmjs.com/package/parcel).  To use a different bundler, pass the `--template` option to `create-ol-app`.

The default template uses Parcel.  This is equivalent to running the following:

    npx create-ol-app my-app --template parcel

To see what other templates are available, see the help output for the `create-ol-app` program:

    npx create-ol-app --help

To use webpack instead of Parcel, run the following:

    npx create-ol-app my-app --template webpack

After creating a new application, see the included `readme.md` for more details on getting started.
