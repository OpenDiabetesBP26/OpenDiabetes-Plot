"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_url_1 = __importDefault(require("./get-url"));
const get_code_1 = __importDefault(require("./get-code"));
const content_types_1 = __importDefault(require("../assets/content-types"));
function isLegacyTest(test) {
    return !!test.isLegacy;
}
exports.isLegacyTest = isLegacyTest;
function register(proxy, tests) {
    const routes = [];
    tests.forEach(test => {
        if (isLegacyTest(test))
            return;
        test.clientScripts.forEach((script) => {
            const route = get_url_1.default(script);
            proxy.GET(route, {
                content: get_code_1.default(script),
                contentType: content_types_1.default.javascript
            });
            routes.push(route);
        });
    });
    return routes;
}
exports.register = register;
function unRegister(proxy, routes) {
    routes.forEach(route => {
        proxy.unRegisterRoute(route, 'GET');
    });
}
exports.unRegister = unRegister;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jdXN0b20tY2xpZW50LXNjcmlwdHMvcm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFpRDtBQUNqRCwwREFBbUQ7QUFDbkQsNEVBQW9EO0FBZXBELFNBQWdCLFlBQVksQ0FBRSxJQUFjO0lBQ3hDLE9BQU8sQ0FBQyxDQUFFLElBQW1CLENBQUMsUUFBUSxDQUFDO0FBQzNDLENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLFFBQVEsQ0FBRSxLQUFZLEVBQUUsS0FBaUI7SUFDckQsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBRTVCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDakIsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ2xCLE9BQU87UUFFWCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQW9CLEVBQUUsRUFBRTtZQUNoRCxNQUFNLEtBQUssR0FBRyxpQkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUvQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDYixPQUFPLEVBQU0sa0JBQXlCLENBQUMsTUFBTSxDQUFDO2dCQUM5QyxXQUFXLEVBQUUsdUJBQWEsQ0FBQyxVQUFVO2FBQ3hDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFwQkQsNEJBb0JDO0FBRUQsU0FBZ0IsVUFBVSxDQUFFLEtBQVksRUFBRSxNQUFnQjtJQUN0RCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUpELGdDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdldEN1c3RvbUNsaWVudFNjcmlwdFVybCBmcm9tICcuL2dldC11cmwnO1xuaW1wb3J0IGdldEN1c3RvbUNsaWVudFNjcmlwdENvZGUgZnJvbSAnLi9nZXQtY29kZSc7XG5pbXBvcnQgQ09OVEVOVF9UWVBFUyBmcm9tICcuLi9hc3NldHMvY29udGVudC10eXBlcyc7XG5pbXBvcnQgQ2xpZW50U2NyaXB0IGZyb20gJy4vY2xpZW50LXNjcmlwdCc7XG5pbXBvcnQgeyBQcm94eSB9IGZyb20gJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnO1xuXG5cbmludGVyZmFjZSBUZXN0IHtcbiAgICBjbGllbnRTY3JpcHRzOiBDbGllbnRTY3JpcHRbXTtcbn1cblxuaW50ZXJmYWNlIExlZ2FjeVRlc3Qge1xuICAgIGlzTGVnYWN5OiBib29sZWFuO1xufVxuXG50eXBlIFRlc3RJdGVtID0gVGVzdCB8IExlZ2FjeVRlc3Q7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xlZ2FjeVRlc3QgKHRlc3Q6IFRlc3RJdGVtKTogdGVzdCBpcyBMZWdhY3lUZXN0IHtcbiAgICByZXR1cm4gISEodGVzdCBhcyBMZWdhY3lUZXN0KS5pc0xlZ2FjeTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyIChwcm94eTogUHJveHksIHRlc3RzOiBUZXN0SXRlbVtdKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJvdXRlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHRlc3RzLmZvckVhY2godGVzdCA9PiB7XG4gICAgICAgIGlmIChpc0xlZ2FjeVRlc3QodGVzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGVzdC5jbGllbnRTY3JpcHRzLmZvckVhY2goKHNjcmlwdDogQ2xpZW50U2NyaXB0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3V0ZSA9IGdldEN1c3RvbUNsaWVudFNjcmlwdFVybChzY3JpcHQpO1xuXG4gICAgICAgICAgICBwcm94eS5HRVQocm91dGUsIHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAgICAgZ2V0Q3VzdG9tQ2xpZW50U2NyaXB0Q29kZShzY3JpcHQpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBDT05URU5UX1RZUEVTLmphdmFzY3JpcHRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvdXRlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuUmVnaXN0ZXIgKHByb3h5OiBQcm94eSwgcm91dGVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgICAgcHJveHkudW5SZWdpc3RlclJvdXRlKHJvdXRlLCAnR0VUJyk7XG4gICAgfSk7XG59XG4iXX0=