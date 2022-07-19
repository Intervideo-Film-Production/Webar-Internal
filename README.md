# Intervideo WebAR guide

### I. WebAR application (Frontend)
**1. The source code is currently managed from [here](https://github.com/eman2XR/BraunWebAR)**

**2. Netlify:**
- WebAR hosting and the domain is currently managed in [Intervideo](https://app.netlify.com/teams/mail-wnyns5s/overview) team in Netlify platform. To access this workspace, you must use an email or github/gitlab account to signup. More importantly, your register account must be invited as a member of Intervideo team so you can switch to the team's site after logging in.

- After successfully accessing the team's site you will be able to select **www.webar-wip.com** site from [Sites](https://app.netlify.com/teams/mail-wnyns5s/sites) page. The site's overview page will then be displayed that provides access to the site's deploy settings, domain settings and deployment history.

**3. Deployment**
WebAR frontend application is currently deployed using the CI/CD pipeline provided by Netlify. 
- First, the source code repository was first linked to Netlify that formed the current deployment workspace. 
- [Deploy settings](https://app.netlify.com/sites/competent-bhaskara-4d24c2/settings/deploys) were then be added that specify which branch from the source code should be watched and deployed when the source code is changed. 
	> **Note:** it is possible to deploy multiple branches.
- Build command, directory and publish directory must also be provided when configuring deploy setting. It is similar to when a React application is manually built and deployed. Below is an example to deploy a React application:
```
Base directory: /
Build command: npm run build
Publish directory: build/
```
- Build settings can also be set in the local environment by adding **netlify.toml** to the root directory of the source code. If build settings are found from both Netlify interface and local environment,  the latter one will be prioritized.

**4. Domain**
[Domain settings](https://app.netlify.com/sites/competent-bhaskara-4d24c2/settings/domain) are also managed by Netlify. If a domain is bought from within Netlify, the domain alias can be added to the site and DNS records will be configurated automatically. If a domain is bought from an external domain provider, DNS records and NS servers must be configurated from the provider's administration site.

The detailed instructions of site settings and domain settings can be found in [Netlify docs](https://docs.netlify.com/)

**5. Environment variables**
Environment variables can be found in ```.env.***``` files in the source code. The values to be utilized can be found from [Sanity management site](https://www.sanity.io/organizations/oWhjuYTfK/project/e9pr2ckl)

The available environment variables are listed below:

- `REACT_APP_PROJECT_ID`: sanity project ID, can be found from sanity management site.
- `REACT_APP_DATASET`: sanity targeting dataset, canbe found from sanity management site. **Note**: this variable is ignored when `REACT_APP_STATIC_DATA` is `TRUE`
- `REACT_APP_STATIC_DATA`: determine whether webAR application should get static data or not. **Note:** The value should be `TRUE` or `FALSE` (`true`/`false` are not correct). Any values other than `TRUE` will be treated as `FALSE`.

**Static data mode**
When enabling static data mode by setting `REACT_APP_STATIC_DATA` to `TRUE`, instead of fetching data from Sanity server, webAR app will seek for static data from `sourceData` directory within the application (in development mode, `sourceData` directory is placed inside `public` directory). Thus, static data should be downloaded and placed into the mentioned folder to allow static data mode to work. Intructions for downloading static data can be found [here](#iii-webar-static-data-server)

**Note:** Currently, static data can only be updated manually, which means Sanity administrators must handle the updating process including:
- Downloading data
- Unzip data
- Replace old data in `sourceData` directory with the new one (old data should be removed first to avoid unused assets).

The process will be the same regardless environments and the stage of webAR application (built or development)

In addition, static data is only a local version of data from Sanity. Since data from Sanity is updated when Sanity administrator/editor changes the content in Sanity Studio, local static data is considered stale and need updating. To support comparing the versions of static data, the date and time when static data is exported are printed in DevTools.

**6. Project branches**
| Branch | Domain | Env | 
|--|--|--|
| main | webar-wip.com | production |
| netlify_development | netlify-development.webar-wip.com | development |
| development |  | development |

Above are the main branches of WebAR project. In particular, a new feature should be developed on **development** branch before deploying to **netlify_development** branch for testing in a real environment. Once a feature is tested, it can be published into **main** branch.

### II. Run WebAR locally
**1. Preresiquites**
- To test the application with local server on your phone, ensure that both your PC/laptop and your phone are connected to the same wifi 
network.
- Install [nodejs](https://nodejs.org) or [nvm](https://github.com/nvm-sh/nvm)
**2. Steps**
- Check environmental variables from section I.5
- Run `npm install` from root directory
- Run `npm install` in the serve directory
- Run `npm run watch` from root directory
- Run `npm run serve:windows` for windows or `npm run serve:mac` for Macbook
- After `npm run serve` script has already generated the server ip, authorize the local server ip in the self-hosted settings in the project workspace on 8thwall.
- Also register the local server url to CORS origins list on Sanity's orginization workspace. Ensure that "Allow credentials" option is selected.
- Depends on the dataset to which WebAR application is connected, create a qr code url from these patterns: 
https://{ip:port}/initialize?sid={storeQRCodeValue} 
-- or --
https://{ip:port}/initialize?sid={storeQRCodeValue}&productqr={productQRCodeValue}

in which: **ip** and **port** are generated from `npm run serve` script, **storeQRCodeValue** and **productQRCodeValue** can be found from sanity studio: **QR Codes** and **Products** sections respectively.

--- continue... ---

### III. Sanity studio (Backend)
[Sanity](https://www.sanity.io/) is a headless CMS platform that allows programmers to customize data structure as well as part of its administration UI. To create and modify data structure and administration UI, programmers must interact with @sanity/cli and Sanity Studio in the local environment. The detailed instruction can be found from [Sanity documentation](https://www.sanity.io/docs/getting-started-with-sanity-cli)

**1. Datasets**

3 datasets are currently available from from Sanity Studio: production, staging, development.
- Production dataset is currently served directly from Sanity on [webar-wip.com](https://webar-wip.com). The dataset or its static data should also be served in webAR released version.
- Staging dataset is product dataset's replicate which allow testing webAR features with real data. As for it's nature, Staging dataset should be updated frequently from production. This can be done using [@sanity/cli](https://www.sanity.io/docs/migrating-data)
- Development dataset is used for development only, data and assets in the dataset can be faked.

**2. Sanity Studio source code for WebAR project is currently managed from [eman2XR](https://github.com/eman2XR)/[BraunWebAR-server](https://github.com/eman2XR/BraunWebAR-server)**

**3. Deployment**
As Sanity's APIs and services are managed by Sanity itself, only Sanity Studio is deployable since it is customized and managed by programmers. In particular, Sanity Studio can be deployed to Sanity cloud platform using @sanity/cli commands:
```
	sanity build
	sanity deploy
```
On the other hand, Sanity Studio can also be self-hosted. Since Sanity Studio is basically a React application, it can be built and deployed in the same way as any other web application. In the case of this project, [Sanity Studio for production](https://webar.sanity.studio/desk) is deployed to Sanity cloud platform, while [Sanity Studio site for testing](https://webar-sanity-dev.netlify.app/dashboard) is deployed using Netlify. In addition, information regarding this sanity workspace can be found from the [Sanity management site](https://www.sanity.io/organizations/oWhjuYTfK/project/e9pr2ckl)

**4. Dashboard**

Represents general information about the current project including project Id and dataset. Dashboard section also allows managing `WEBAR APPLICATION URL` which helps generating qrCodes in `Desk/QR Codes` page. In addition, Dashboard can be linked to Static data server using `DATA GENERATE SERVER URL` field to download static data.

**NOTE**: `Download` button can only be enabled if Sanity studio successfully connects to Static data server. Ensure that both Sanity and Static data server allows secure HTTP requests from the other. In particular, Static data server's domain must be added into CORS origins list in Sanity management page with `Allow credentials` option checked. On the other hand, Static data server must allow cross-origin requests from Sanity as well and must have SSL enabled (can be done using Let's Encrypt). Data can then be simply downloaded by clicking `download` button, the content of the downloaded data includes `data.json` file, locale json files, and assets. Data can be simply copy/paste into `sourceData` directory afterward.

**5. Media**

Media represents and manages the assets in Sanity studio. It is recommended that unused assets should be cleaned to avoid size overhead when downloading static data. It is also recommended that images to be used/included into Sanity studio should be equal or less than 5mb to avoid performance overhead when exporting static data. This help reducing the likelihood of failing to convert images to .webp extension. If the original image cannot be converted, it will be used directly in webAR app which may cause noticeable performance issues.

**6. Support languages list**

This section reflexes the currently set languages setting in [webAR-server](https://github.com/eman2XR/BraunWebAR-server) project. **NOTE:** Currently, to update/add new languages, it is required to visit this section once the webAR-server project has been redeployed. This step updates the languages setting in targeted dataset thus make it available to webAR client.

### III. WebAR static data server
[WebAR static data server](https://webar-wip-data.com) supports downloading data and assets from Sanity. In addition, the server can also be used to test webAR static data mode against real data (from production or staging datasets). This is done by deploying a built version of webAR application with `REACT_APP_STATIC_DATA` is `TRUE` into `public` folder.

**1. Key points:**
- Operating system: AWS EC2 - Ubuntu 20.04 LTS, Nginx
- Platform: NodeJS
- Managing services: Git, PM2

**NOTE:** The static data server should only be exposed to Sanity server. This can be configurated by adjusting inbound/outbound rules on the EC2 instance's security group.
 