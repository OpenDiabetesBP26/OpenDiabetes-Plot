"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const replicator_1 = __importDefault(require("replicator"));
const builder_symbol_1 = __importDefault(require("./builder-symbol"));
const compile_client_function_1 = __importDefault(require("../compiler/compile-client-function"));
function createReplicator(transforms) {
    // NOTE: we will serialize replicator results
    // to JSON with a command or command result.
    // Therefore there is no need to do additional job here,
    // so we use identity functions for serialization.
    const replicator = new replicator_1.default({
        serialize: lodash_1.identity,
        deserialize: lodash_1.identity
    });
    return replicator.addTransforms(transforms);
}
exports.createReplicator = createReplicator;
// Replicator transforms
class FunctionTransform {
    constructor(callsiteNames) {
        this.type = 'Function';
        this.callsiteNames = callsiteNames;
    }
    shouldTransform(type) {
        return type === 'function';
    }
    toSerializable(fn) {
        const clientFnBuilder = fn[builder_symbol_1.default];
        if (clientFnBuilder) {
            return {
                fnCode: clientFnBuilder.compiledFnCode,
                dependencies: clientFnBuilder.getFunctionDependencies()
            };
        }
        return {
            fnCode: compile_client_function_1.default(fn.toString(), null, this.callsiteNames.instantiation, this.callsiteNames.execution),
            dependencies: {}
        };
    }
    fromSerializable() {
        return void 0;
    }
}
exports.FunctionTransform = FunctionTransform;
class SelectorNodeTransform {
    constructor() {
        this.type = 'Node';
    }
    shouldTransform() {
        return false;
    }
    fromSerializable(nodeSnapshot) {
        return nodeSnapshot;
    }
}
exports.SelectorNodeTransform = SelectorNodeTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGljYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3JlcGxpY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBa0M7QUFDbEMsNERBQW9DO0FBQ3BDLHNFQUFxRDtBQUNyRCxrR0FBd0U7QUFFeEUsU0FBZ0IsZ0JBQWdCLENBQUUsVUFBVTtJQUN4Qyw2Q0FBNkM7SUFDN0MsNENBQTRDO0lBQzVDLHdEQUF3RDtJQUN4RCxrREFBa0Q7SUFDbEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxvQkFBVSxDQUFDO1FBQzlCLFNBQVMsRUFBSSxpQkFBUTtRQUNyQixXQUFXLEVBQUUsaUJBQVE7S0FDeEIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFYRCw0Q0FXQztBQUVELHdCQUF3QjtBQUN4QixNQUFhLGlCQUFpQjtJQUMxQixZQUFhLGFBQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBWSxVQUFVLENBQUM7UUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELGVBQWUsQ0FBRSxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxLQUFLLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRUQsY0FBYyxDQUFFLEVBQUU7UUFDZCxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsd0JBQXFCLENBQUMsQ0FBQztRQUVsRCxJQUFJLGVBQWUsRUFBRTtZQUNqQixPQUFPO2dCQUNILE1BQU0sRUFBUSxlQUFlLENBQUMsY0FBYztnQkFDNUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRTthQUMxRCxDQUFDO1NBQ0w7UUFFRCxPQUFPO1lBQ0gsTUFBTSxFQUFRLGlDQUFxQixDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7WUFDeEgsWUFBWSxFQUFFLEVBQUU7U0FDbkIsQ0FBQztJQUNOLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixPQUFPLEtBQUssQ0FBQyxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQTdCRCw4Q0E2QkM7QUFFRCxNQUFhLHFCQUFxQjtJQUM5QjtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxlQUFlO1FBQ1gsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELGdCQUFnQixDQUFFLFlBQVk7UUFDMUIsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBWkQsc0RBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUmVwbGljYXRvciBmcm9tICdyZXBsaWNhdG9yJztcbmltcG9ydCBmdW5jdGlvbkJ1aWxkZXJTeW1ib2wgZnJvbSAnLi9idWlsZGVyLXN5bWJvbCc7XG5pbXBvcnQgY29tcGlsZUNsaWVudEZ1bmN0aW9uIGZyb20gJy4uL2NvbXBpbGVyL2NvbXBpbGUtY2xpZW50LWZ1bmN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlcGxpY2F0b3IgKHRyYW5zZm9ybXMpIHtcbiAgICAvLyBOT1RFOiB3ZSB3aWxsIHNlcmlhbGl6ZSByZXBsaWNhdG9yIHJlc3VsdHNcbiAgICAvLyB0byBKU09OIHdpdGggYSBjb21tYW5kIG9yIGNvbW1hbmQgcmVzdWx0LlxuICAgIC8vIFRoZXJlZm9yZSB0aGVyZSBpcyBubyBuZWVkIHRvIGRvIGFkZGl0aW9uYWwgam9iIGhlcmUsXG4gICAgLy8gc28gd2UgdXNlIGlkZW50aXR5IGZ1bmN0aW9ucyBmb3Igc2VyaWFsaXphdGlvbi5cbiAgICBjb25zdCByZXBsaWNhdG9yID0gbmV3IFJlcGxpY2F0b3Ioe1xuICAgICAgICBzZXJpYWxpemU6ICAgaWRlbnRpdHksXG4gICAgICAgIGRlc2VyaWFsaXplOiBpZGVudGl0eVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcGxpY2F0b3IuYWRkVHJhbnNmb3Jtcyh0cmFuc2Zvcm1zKTtcbn1cblxuLy8gUmVwbGljYXRvciB0cmFuc2Zvcm1zXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25UcmFuc2Zvcm0ge1xuICAgIGNvbnN0cnVjdG9yIChjYWxsc2l0ZU5hbWVzKSB7XG4gICAgICAgIHRoaXMudHlwZSAgICAgICAgICA9ICdGdW5jdGlvbic7XG4gICAgICAgIHRoaXMuY2FsbHNpdGVOYW1lcyA9IGNhbGxzaXRlTmFtZXM7XG4gICAgfVxuXG4gICAgc2hvdWxkVHJhbnNmb3JtICh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIHRvU2VyaWFsaXphYmxlIChmbikge1xuICAgICAgICBjb25zdCBjbGllbnRGbkJ1aWxkZXIgPSBmbltmdW5jdGlvbkJ1aWxkZXJTeW1ib2xdO1xuXG4gICAgICAgIGlmIChjbGllbnRGbkJ1aWxkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZm5Db2RlOiAgICAgICBjbGllbnRGbkJ1aWxkZXIuY29tcGlsZWRGbkNvZGUsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBjbGllbnRGbkJ1aWxkZXIuZ2V0RnVuY3Rpb25EZXBlbmRlbmNpZXMoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmbkNvZGU6ICAgICAgIGNvbXBpbGVDbGllbnRGdW5jdGlvbihmbi50b1N0cmluZygpLCBudWxsLCB0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbiwgdGhpcy5jYWxsc2l0ZU5hbWVzLmV4ZWN1dGlvbiksXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IHt9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnJvbVNlcmlhbGl6YWJsZSAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0b3JOb2RlVHJhbnNmb3JtIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdOb2RlJztcbiAgICB9XG5cbiAgICBzaG91bGRUcmFuc2Zvcm0gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnJvbVNlcmlhbGl6YWJsZSAobm9kZVNuYXBzaG90KSB7XG4gICAgICAgIHJldHVybiBub2RlU25hcHNob3Q7XG4gICAgfVxufVxuIl19