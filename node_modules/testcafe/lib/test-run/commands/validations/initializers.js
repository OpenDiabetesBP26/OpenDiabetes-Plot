"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selector_builder_1 = __importDefault(require("../../../client-functions/selectors/selector-builder"));
const test_run_1 = require("../../../errors/test-run");
const runtime_1 = require("../../../errors/runtime");
const observation_1 = require("../observation");
const execute_js_expression_1 = require("../../execute-js-expression");
const utils_1 = require("../utils");
function initUploadSelector(name, val, initOptions) {
    initOptions.skipVisibilityCheck = true;
    return initSelector(name, val, initOptions);
}
exports.initUploadSelector = initUploadSelector;
function initSelector(name, val, _a) {
    var { testRun } = _a, options = __rest(_a, ["testRun"]);
    if (val instanceof observation_1.ExecuteSelectorCommand)
        return val;
    try {
        if (utils_1.isJSExpression(val))
            val = execute_js_expression_1.executeJsExpression(val.value, testRun, options);
        const { skipVisibilityCheck } = options, builderOptions = __rest(options, ["skipVisibilityCheck"]);
        const builder = new selector_builder_1.default(val, Object.assign({ visibilityCheck: !skipVisibilityCheck }, builderOptions), { instantiation: 'Selector' });
        return builder.getCommand([]);
    }
    catch (err) {
        throw new test_run_1.ActionSelectorError(name, err, err instanceof runtime_1.APIError);
    }
}
exports.initSelector = initSelector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Rlc3QtcnVuL2NvbW1hbmRzL3ZhbGlkYXRpb25zL2luaXRpYWxpemVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNEdBQW1GO0FBQ25GLHVEQUErRDtBQUMvRCxxREFBbUQ7QUFDbkQsZ0RBQXdEO0FBQ3hELHVFQUFrRTtBQUNsRSxvQ0FBMEM7QUFFMUMsU0FBZ0Isa0JBQWtCLENBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxXQUFXO0lBQ3RELFdBQVcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7SUFFdkMsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBSkQsZ0RBSUM7QUFFRCxTQUFnQixZQUFZLENBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUF1QjtRQUF2QixFQUFFLE9BQU8sT0FBYyxFQUFaLGlDQUFVO0lBQzFELElBQUksR0FBRyxZQUFZLG9DQUFzQjtRQUNyQyxPQUFPLEdBQUcsQ0FBQztJQUVmLElBQUk7UUFDQSxJQUFJLHNCQUFjLENBQUMsR0FBRyxDQUFDO1lBQ25CLEdBQUcsR0FBRywyQ0FBbUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUzRCxNQUFNLEVBQUUsbUJBQW1CLEtBQXdCLE9BQU8sRUFBN0IseURBQTZCLENBQUM7UUFFM0QsTUFBTSxPQUFPLEdBQUcsSUFBSSwwQkFBZSxDQUFDLEdBQUcsa0JBQ25DLGVBQWUsRUFBRSxDQUFDLG1CQUFtQixJQUNsQyxjQUFjLEdBQ2xCLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFbEMsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2pDO0lBQ0QsT0FBTyxHQUFHLEVBQUU7UUFDUixNQUFNLElBQUksOEJBQW1CLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLFlBQVksa0JBQVEsQ0FBQyxDQUFDO0tBQ3JFO0FBQ0wsQ0FBQztBQXBCRCxvQ0FvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VsZWN0b3JCdWlsZGVyIGZyb20gJy4uLy4uLy4uL2NsaWVudC1mdW5jdGlvbnMvc2VsZWN0b3JzL3NlbGVjdG9yLWJ1aWxkZXInO1xuaW1wb3J0IHsgQWN0aW9uU2VsZWN0b3JFcnJvciB9IGZyb20gJy4uLy4uLy4uL2Vycm9ycy90ZXN0LXJ1bic7XG5pbXBvcnQgeyBBUElFcnJvciB9IGZyb20gJy4uLy4uLy4uL2Vycm9ycy9ydW50aW1lJztcbmltcG9ydCB7IEV4ZWN1dGVTZWxlY3RvckNvbW1hbmQgfSBmcm9tICcuLi9vYnNlcnZhdGlvbic7XG5pbXBvcnQgeyBleGVjdXRlSnNFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vZXhlY3V0ZS1qcy1leHByZXNzaW9uJztcbmltcG9ydCB7IGlzSlNFeHByZXNzaW9uIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFVwbG9hZFNlbGVjdG9yIChuYW1lLCB2YWwsIGluaXRPcHRpb25zKSB7XG4gICAgaW5pdE9wdGlvbnMuc2tpcFZpc2liaWxpdHlDaGVjayA9IHRydWU7XG5cbiAgICByZXR1cm4gaW5pdFNlbGVjdG9yKG5hbWUsIHZhbCwgaW5pdE9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNlbGVjdG9yIChuYW1lLCB2YWwsIHsgdGVzdFJ1biwgLi4ub3B0aW9ucyB9KSB7XG4gICAgaWYgKHZhbCBpbnN0YW5jZW9mIEV4ZWN1dGVTZWxlY3RvckNvbW1hbmQpXG4gICAgICAgIHJldHVybiB2YWw7XG5cbiAgICB0cnkge1xuICAgICAgICBpZiAoaXNKU0V4cHJlc3Npb24odmFsKSlcbiAgICAgICAgICAgIHZhbCA9IGV4ZWN1dGVKc0V4cHJlc3Npb24odmFsLnZhbHVlLCB0ZXN0UnVuLCBvcHRpb25zKTtcblxuICAgICAgICBjb25zdCB7IHNraXBWaXNpYmlsaXR5Q2hlY2ssIC4uLmJ1aWxkZXJPcHRpb25zIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKHZhbCwge1xuICAgICAgICAgICAgdmlzaWJpbGl0eUNoZWNrOiAhc2tpcFZpc2liaWxpdHlDaGVjayxcbiAgICAgICAgICAgIC4uLmJ1aWxkZXJPcHRpb25zXG4gICAgICAgIH0sIHsgaW5zdGFudGlhdGlvbjogJ1NlbGVjdG9yJyB9KTtcblxuICAgICAgICByZXR1cm4gYnVpbGRlci5nZXRDb21tYW5kKFtdKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQWN0aW9uU2VsZWN0b3JFcnJvcihuYW1lLCBlcnIsIGVyciBpbnN0YW5jZW9mIEFQSUVycm9yKTtcbiAgICB9XG59XG4iXX0=