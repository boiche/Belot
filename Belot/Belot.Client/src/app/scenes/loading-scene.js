"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_1 = require("phaser");
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        return _super.call(this, "LoadingBelot") || this;
    }
    LoadingScene.prototype.create = function () {
        this.showLoader();
    };
    LoadingScene.prototype.showLoader = function () {
        this.add.image(0, 0, "background").setDisplaySize(window.innerWidth, window.innerHeight).setOrigin(0);
    };
    return LoadingScene;
}(phaser_1.Scene));
exports.default = LoadingScene;
//# sourceMappingURL=loading-scene.js.map