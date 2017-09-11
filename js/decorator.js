define('js/decorator', ['require', 'exports', 'module'], function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function (k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
  };
  exports.__esModule = true;
  var viewModelPrototypeMap = new WeakMap();
  function viewModel(constructor) {
      return /** @class */ (function (_super) {
          __extends(class_1, _super);
          function class_1() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var _this = _super.apply(this, args) || this;
              var self = _this;
              var descriptorFactoryMaps = viewModelPrototypeMap.get(constructor.prototype);
              if (!descriptorFactoryMaps) {
                  return _this;
              }
              for (var key in descriptorFactoryMaps) {
                  if (descriptorFactoryMaps.hasOwnProperty(key)) {
                      var descriptorFactories = descriptorFactoryMaps[key];
                      var descriptor = Object.getOwnPropertyDescriptor(self, key);
                      for (var index = 0; index < descriptorFactories.length; index++) {
                          var descriptorFactory = descriptorFactories[index];
                          descriptor = descriptorFactory(self, key, descriptor);
                      }
                      descriptor.configurable = true;
                      Object.defineProperty(self, key, descriptor);
                  }
              }
              return _this;
          }
          return class_1;
      }(constructor));
  }
  exports.viewModel = viewModel;
  function observableDescriptorFactiory(target, propertyName, descriptor) {
      var newDescriptor = {};
      var originDescriptor = descriptor || {};
      var tempVal = originDescriptor.value || target[propertyName];
      if (originDescriptor.get) {
          newDescriptor.get = function () {
              return originDescriptor.get();
          };
      }
      else {
          newDescriptor.get = function () {
              return tempVal;
          };
      }
      if (originDescriptor.set) {
          newDescriptor.set = function (val) {
              originDescriptor.set.call(this, val);
              tempVal = val;
          };
      }
      else {
          newDescriptor.set = function (val) {
              tempVal = val;
          };
      }
      return newDescriptor;
  }
  function ensurePropertyDescriptorFactories(target, propertyName) {
      var descriptors = viewModelPrototypeMap.get(target);
      if (!descriptors) {
          descriptors = {};
          viewModelPrototypeMap.set(target, descriptors);
      }
      if (!descriptors[propertyName]) {
          descriptors[propertyName] = [];
      }
      return descriptors[propertyName];
  }
  exports.observable = function (target, propertyName, descriptor) {
      ensurePropertyDescriptorFactories(target, propertyName).push(observableDescriptorFactiory);
      return descriptor;
  };
  var B = /** @class */ (function () {
      function B() {
          this.a = 1;
      }
      Object.defineProperty(B.prototype, "b", {
          get: function () {
              return false;
          },
          enumerable: true,
          configurable: true
      });
      __decorate([
          exports.observable,
          __metadata("design:type", Object)
      ], B.prototype, "a");
      __decorate([
          exports.observable,
          __metadata("design:type", Boolean),
          __metadata("design:paramtypes", [])
      ], B.prototype, "b");
      B = __decorate([
          viewModel
      ], B);
      return B;
  }());
  

});