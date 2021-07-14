"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var express_1 = __importDefault(require("express"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var serve = function (port, filename, dir) {
    var app = express_1.default();
    app.use(http_proxy_middleware_1.createProxyMiddleware({
        target: 'https://localhost:3000',
        ws: true,
        logLevel: 'silent'
    }));
    // create own promise to either resolve or reject
    return new Promise(function (resolve, reject) {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
