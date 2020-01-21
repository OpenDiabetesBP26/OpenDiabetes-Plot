"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emittery_1 = __importDefault(require("emittery"));
class AsyncEventEmitter extends emittery_1.default {
    once(event, listener) {
        return new Promise((resolve, reject) => {
            const off = this.on(event, function (data) {
                try {
                    off();
                    const result = listener ? listener.call(this, data) : data;
                    resolve(result);
                    return result;
                }
                catch (e) {
                    reject(e);
                    throw e;
                }
            });
        });
    }
}
exports.default = AsyncEventEmitter;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtZXZlbnQtZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hc3luYy1ldmVudC1lbWl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE1BQXFCLGlCQUFrQixTQUFRLGtCQUFRO0lBQ25ELElBQUksQ0FBRSxLQUFLLEVBQUUsUUFBUTtRQUNqQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQVUsSUFBSTtnQkFDckMsSUFBSTtvQkFDQSxHQUFHLEVBQUUsQ0FBQztvQkFFTixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBRTNELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFaEIsT0FBTyxNQUFNLENBQUM7aUJBQ2pCO2dCQUNELE9BQU8sQ0FBQyxFQUFFO29CQUNOLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFVixNQUFNLENBQUMsQ0FBQztpQkFDWDtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFyQkQsb0NBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtaXR0ZXJ5IGZyb20gJ2VtaXR0ZXJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXN5bmNFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFbWl0dGVyeSB7XG4gICAgb25jZSAoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvZmYgPSB0aGlzLm9uKGV2ZW50LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGxpc3RlbmVyID8gbGlzdGVuZXIuY2FsbCh0aGlzLCBkYXRhKSA6IGRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcblxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=