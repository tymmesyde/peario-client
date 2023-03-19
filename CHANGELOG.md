# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.12.2](https://github.com/tymmesyde/peario-client/compare/v0.12.1...v0.12.2) (2023-03-19)


### Bug Fixes

* **App:** scroll issue on firefox on mobile screen ([6dbb916](https://github.com/tymmesyde/peario-client/commit/6dbb916ce12336744a00fa4f697c755aeb8a0fb7))
* disable legacy mode for vue-18n ([01e5e7c](https://github.com/tymmesyde/peario-client/commit/01e5e7cc33895c13d16eaebe75970bc49502fe8d))

### [0.12.1](https://github.com/tymmesyde/peario-client/compare/v0.12.0...v0.12.1) (2023-03-18)


### Features

* add loading indicator on Search and Streams ([afda51b](https://github.com/tymmesyde/peario-client/commit/afda51bd6c349a0af5dc936f6ec2b2ee8c4ffa83))
* show toast when user addon successfully added ([99a09e7](https://github.com/tymmesyde/peario-client/commit/99a09e7cfbc48fd8a4989c28986cb84d8ada4fab))


### Bug Fixes

* **AddonManager:** layout was broken ([91770bf](https://github.com/tymmesyde/peario-client/commit/91770bfa392fb37c98beb8a5ceef44fdb419dc8f))

## [0.12.0](https://github.com/tymmesyde/peario-client/compare/v0.11.8...v0.12.0) (2022-05-14)


### ⚠ BREAKING CHANGES

* store installed addons by transportUrl

### Features

* add community list link on AddonManager ([0ed6a4a](https://github.com/tymmesyde/peario-client/commit/0ed6a4a2bf0fd0258b49b1e9f24161cb04c555c2))
* allow addon share links from stremio to be added ([55feaad](https://github.com/tymmesyde/peario-client/commit/55feaadffce0b3663a4dc539b97081c9f4aca6d9))
* handle http streams ([8e53932](https://github.com/tymmesyde/peario-client/commit/8e539323bd36a72b4da3cc56f07a35b18d2c2b60))
* implement update room ownership ([d4b741b](https://github.com/tymmesyde/peario-client/commit/d4b741b06bcd84089c14ba245209c50a1267fe71))
* sort streams by addons on Stream ([6db0aa0](https://github.com/tymmesyde/peario-client/commit/6db0aa05f508f1ec938071c54a80efa8c378bbfd))


### Bug Fixes

* **AddonManager:** await addUserAddon disaptch before loading Addons ([6e5cb7d](https://github.com/tymmesyde/peario-client/commit/6e5cb7dde4a768cc7e0176ed7e2c59e196e360e3))
* **Room:** users-list was over chat on mobile ([1abc9be](https://github.com/tymmesyde/peario-client/commit/1abc9be5cd7fae73f570ad74ec5adb6c1f2dae28))
* store installed addons by transportUrl ([e5a7091](https://github.com/tymmesyde/peario-client/commit/e5a7091ddbca581a911ce8d195a613b630e548e6))
* **Stream:** key issue ([4b5a8de](https://github.com/tymmesyde/peario-client/commit/4b5a8def9f91e2558b776d38305ef6474840bc0a))
* styling issue ([be51248](https://github.com/tymmesyde/peario-client/commit/be512483a549966d3f093c016d4dd70cffc63dc1))
* styling issue with List on Stream ([da5564f](https://github.com/tymmesyde/peario-client/commit/da5564f5ef80fbe47614c8794dd2652cb242c0e0))
* **Subtitles:** layout issue ([274b0d4](https://github.com/tymmesyde/peario-client/commit/274b0d45de327ac82ed47873f90e38c9c682083b))
* **Subtitles:** minor styling issue ([e3dc306](https://github.com/tymmesyde/peario-client/commit/e3dc30656c00ad4e1b21c73e68b5710ad2d649f7))
* **UsersList:** styling issue ([b45de22](https://github.com/tymmesyde/peario-client/commit/b45de225f5a14508be23b5ebc4b1368ea3f80e7d))

### [0.11.8](https://github.com/tymmesyde/peario-client/compare/v0.10.7...v0.11.8) (2022-05-01)


### Features

* **TimeBar:** implement seeking with arrow keys ([6147ea4](https://github.com/tymmesyde/peario-client/commit/6147ea480bd817241d7b9472845f206510412117))


### Bug Fixes

* **addon.service.js:** don't filter idPrefixes for subtitles addons ([7b4b7a8](https://github.com/tymmesyde/peario-client/commit/7b4b7a8f917aab377fbb888fb6471df47dfe4927))

### [0.11.6](https://github.com/tymmesyde/peario-client/compare/v0.11.5...v0.11.6) (2021-09-03)


### Features

* can now add subtitles addons while in a room ([51b7b81](https://github.com/tymmesyde/peario-client/commit/51b7b811e43eaebb29ef638e50d44a5421c6f7ac))
* can now use subtitles addons ([d6551a8](https://github.com/tymmesyde/peario-client/commit/d6551a8833736e972e1e7513d847a1e8b1d50056))


### Bug Fixes

* **Room:** creating a hls playlist was blocking the loading ([dc44bc0](https://github.com/tymmesyde/peario-client/commit/dc44bc0dee7d2a85198ce28247b0646c430175b5))
* **Subtitles:** fix errors ([54ae6d2](https://github.com/tymmesyde/peario-client/commit/54ae6d23662566b2286e1d625592c31cb1642521))
* **Subtitles:** user subtitles were partially broken ([a56cdea](https://github.com/tymmesyde/peario-client/commit/a56cdeaa0c432d7cff1a87ff20570e6f01ec1840))

### [0.11.5](https://github.com/tymmesyde/peario-client/compare/v0.11.4...v0.11.5) (2021-09-02)


### Features

* update user username ([8f3891a](https://github.com/tymmesyde/peario-client/commit/8f3891a996b704189d78dfc45a524151be044d7a))

### [0.11.4](https://github.com/tymmesyde/peario-client/compare/v0.11.3...v0.11.4) (2021-07-14)


### Bug Fixes

* wrong z-index layering ([28b27ca](https://github.com/tymmesyde/peario-client/commit/28b27cab84a72b9a8dab51eb8fd9eac727be1c6e))

### [0.11.3](https://github.com/tymmesyde/peario-client/compare/v0.11.2...v0.11.3) (2021-07-13)

### [0.11.2](https://github.com/tymmesyde/peario-client/compare/v0.11.1...v0.11.2) (2021-06-08)

### [0.11.1](https://github.com/tymmesyde/peario-client/compare/v0.11.0...v0.11.1) (2021-06-07)


### Bug Fixes

* some icons were not displayed ([6cf6613](https://github.com/tymmesyde/peario-client/commit/6cf66135a59f311ac6c8ca59755e2b57d953ccb5))
* wait for client to be connected before initializing router ([cb0749c](https://github.com/tymmesyde/peario-client/commit/cb0749c1b7a2de4564b1978db5887e3e5ddbcf0e))

## [0.11.0](https://github.com/tymmesyde/peario-client/compare/v0.10.3...v0.11.0) (2021-06-07)


### ⚠ BREAKING CHANGES

* footer was displayed on mobile

### Features

* new chat feature ([8743f64](https://github.com/tymmesyde/peario-client/commit/8743f641f75ae5a9f38d1d581da1746b859ceaa0))


### Bug Fixes

* footer was displayed on mobile ([94d5689](https://github.com/tymmesyde/peario-client/commit/94d568996ccd7abdbc510aa6cc600eac6ec6fd4f))
* **components:** items in List were not keyed when itemKey was not specified ([73f6f8f](https://github.com/tymmesyde/peario-client/commit/73f6f8f61ed1d97c208f9e98e194b4d4e02a3f6b))
* **services:** addon service was returning Peario in collection ([949ce56](https://github.com/tymmesyde/peario-client/commit/949ce5664b93e7447c9fe56c392a3b04443d62ab))

### [0.10.3](https://github.com/tymmesyde/peario-client/compare/v0.10.2...v0.10.3) (2021-05-23)

### [0.10.2](https://github.com/tymmesyde/peario-client/compare/v0.10.1...v0.10.2) (2021-05-22)


### Bug Fixes

* errors were not showing up ([4ef472c](https://github.com/tymmesyde/peario-client/commit/4ef472c961b2afbb0b9137b6e94dba18d40e8b4f))

### [0.10.1](https://github.com/tymmesyde/peario-client/compare/v0.10.0...v0.10.1) (2021-05-21)


### Bug Fixes

* **player:** volume was not updated when seeked ([baf5c42](https://github.com/tymmesyde/peario-client/commit/baf5c4254051e02a0fc92d325ebb8fc56919c5b7))
* player video was streched ([cd97ad9](https://github.com/tymmesyde/peario-client/commit/cd97ad96e396d21b023b1d239483db1fb515071c))

## [0.10.0](https://github.com/tymmesyde/peario-client/compare/v0.9.2...v0.10.0) (2021-04-17)


### ⚠ BREAKING CHANGES

* can now add addons from URL given by the user

### Features

* can now add addons from URL given by the user ([78fd02a](https://github.com/tymmesyde/peario-client/commit/78fd02af04a0b6a48c6bf502bf7b5b2f687fa8a0))

### [0.9.2](https://github.com/tymmesyde/peario-client/compare/v0.9.1...v0.9.2) (2020-10-04)


### Bug Fixes

* **addons:** refine filtering of addons in the manager ([1937e73](https://github.com/tymmesyde/peario-client/commit/1937e736a63fded18ac2d538aa8e8ef1114960e2))
* **ws:** wait to be connected before loading views ([f863b36](https://github.com/tymmesyde/peario-client/commit/f863b364ca29fde9dd1cad699a8a22c70f552280))

### [0.9.1](https://github.com/tymmesyde/peario-client/compare/v0.9.0...v0.9.1) (2020-10-01)
