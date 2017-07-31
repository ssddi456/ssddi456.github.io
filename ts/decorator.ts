
type IPropertyDescriptorFactory =
    (target, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

interface IDescriptorMap {
    [k: string]: IPropertyDescriptorFactory[];
}
interface IConstructor<T> {
    new(...args: any[]): T;
}

const viewModelPrototypeMap = new WeakMap<object, IDescriptorMap>();

export function viewModel<T extends IConstructor<any>>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            const self = this;
            const descriptorFactoryMaps = viewModelPrototypeMap.get(constructor.prototype);
            if (!descriptorFactoryMaps) {
                return this;
            }

            for (const key in descriptorFactoryMaps) {
                if (descriptorFactoryMaps.hasOwnProperty(key)) {
                    const descriptorFactories = descriptorFactoryMaps[key];
                    let descriptor = Object.getOwnPropertyDescriptor(self, key);

                    for (let index = 0; index < descriptorFactories.length; index++) {
                        const descriptorFactory = descriptorFactories[index];
                        descriptor = descriptorFactory(self, key, descriptor);
                    }

                    descriptor.configurable = true;
                    Object.defineProperty(self, key, descriptor);
                }
            }
        }
    };
}

interface IObservable {
    (target, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor;
    (target, propertyName: string): any;
}

function observableDescriptorFactiory(target, propertyName: string, descriptor: PropertyDescriptor) {
    const newDescriptor = {} as PropertyDescriptor;
    const originDescriptor = descriptor || {};

    let tempVal = originDescriptor.value || target[propertyName];
    if (originDescriptor.get) {
        newDescriptor.get = function () {
            return originDescriptor.get();
        };
    } else {
        newDescriptor.get = function () {
            return tempVal;
        };
    }

    if (originDescriptor.set) {
        newDescriptor.set = function (val) {
            originDescriptor.set.call(this, val);
            tempVal = val;
        };
    } else {
        newDescriptor.set = function (val) {
            tempVal = val;
        };
    }
    return newDescriptor;
}

function ensurePropertyDescriptorFactory(target, propertyName) {

    let descriptors = viewModelPrototypeMap.get(target);
    if (!descriptors) {
        descriptors = {} as IDescriptorMap;
        viewModelPrototypeMap.set(target, descriptors);
    }

    if (!descriptors[propertyName]) {
        descriptors[propertyName] = [] as IPropertyDescriptorFactory[];
    }

    return descriptors[propertyName];
}

export const observable: IObservable = function (target, propertyName, descriptor?) {

    ensurePropertyDescriptorFactory(target, propertyName).push(observableDescriptorFactiory);

    return descriptor;
};

@viewModel
class B {
    @observable
    a = 1;

    @observable
    get b(): boolean {
        return false;
    }
}

export const b = new B();
export const c = new B();
