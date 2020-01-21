"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callsite_record_1 = require("callsite-record");
const templates_1 = __importDefault(require("./templates"));
const create_stack_filter_1 = __importDefault(require("../create-stack-filter"));
const get_callsite_1 = require("../get-callsite");
const render_template_1 = __importDefault(require("../../utils/render-template"));
const render_callsite_sync_1 = __importDefault(require("../../utils/render-callsite-sync"));
const types_1 = require("../types");
const ERROR_SEPARATOR = '\n\n';
class ProcessTemplateInstruction {
    constructor(processFn) {
        this.processFn = processFn;
    }
}
// Errors
class GeneralError extends Error {
    constructor(...args) {
        const code = args.shift();
        const template = templates_1.default[code];
        super(render_template_1.default(template, ...args));
        Object.assign(this, { code, data: args });
        Error.captureStackTrace(this, GeneralError);
    }
}
exports.GeneralError = GeneralError;
class TestCompilationError extends Error {
    constructor(originalError) {
        const template = templates_1.default[types_1.RUNTIME_ERRORS.cannotPrepareTestsDueToError];
        const errorMessage = originalError.toString();
        super(render_template_1.default(template, errorMessage));
        Object.assign(this, {
            code: types_1.RUNTIME_ERRORS.cannotPrepareTestsDueToError,
            data: [errorMessage]
        });
        // NOTE: stack includes message as well.
        this.stack = render_template_1.default(template, originalError.stack);
    }
}
exports.TestCompilationError = TestCompilationError;
class APIError extends Error {
    constructor(methodName, code, ...args) {
        let template = templates_1.default[code];
        template = APIError._prepareTemplateAndArgsIfNecessary(template, args);
        const rawMessage = render_template_1.default(template, ...args);
        super(render_template_1.default(templates_1.default[types_1.RUNTIME_ERRORS.cannotPrepareTestsDueToError], rawMessage));
        Object.assign(this, { code, data: args });
        // NOTE: `rawMessage` is used in error substitution if it occurs in test run.
        this.rawMessage = rawMessage;
        this.callsite = get_callsite_1.getCallsiteForMethod(methodName);
        // NOTE: We need property getters here because callsite can be replaced by an external code.
        // See https://github.com/DevExpress/testcafe/blob/v1.0.0/src/compiler/test-file/formats/raw.js#L22
        // Also we can't use an ES6 getter for the 'stack' property, because it will create a getter on the class prototype
        // that cannot override the instance property created by the Error parent class.
        Object.defineProperties(this, {
            'stack': {
                get: () => this._createStack(callsite_record_1.renderers.noColor)
            },
            'coloredStack': {
                get: () => this._createStack(callsite_record_1.renderers.default)
            }
        });
    }
    _createStack(renderer) {
        const renderedCallsite = render_callsite_sync_1.default(this.callsite, {
            renderer: renderer,
            stackFilter: create_stack_filter_1.default(Error.stackTraceLimit)
        });
        if (!renderedCallsite)
            return this.message;
        return this.message + ERROR_SEPARATOR + renderedCallsite;
    }
    static _prepareTemplateAndArgsIfNecessary(template, args) {
        const lastArg = args.pop();
        if (lastArg instanceof ProcessTemplateInstruction)
            template = lastArg.processFn(template);
        else
            args.push(lastArg);
        return template;
    }
}
exports.APIError = APIError;
class ClientFunctionAPIError extends APIError {
    constructor(methodName, instantiationCallsiteName, code, ...args) {
        args.push(new ProcessTemplateInstruction(template => template.replace(/\{#instantiationCallsiteName\}/g, instantiationCallsiteName)));
        super(methodName, code, ...args);
    }
}
exports.ClientFunctionAPIError = ClientFunctionAPIError;
class CompositeError extends Error {
    constructor(errors) {
        super(errors.map(({ message }) => message).join(ERROR_SEPARATOR));
        this.stack = errors.map(({ stack }) => stack).join(ERROR_SEPARATOR);
        this.code = types_1.RUNTIME_ERRORS.compositeArgumentsError;
    }
}
exports.CompositeError = CompositeError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXJyb3JzL3J1bnRpbWUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBNEM7QUFDNUMsNERBQW9DO0FBQ3BDLGlGQUF1RDtBQUN2RCxrREFBdUQ7QUFDdkQsa0ZBQXlEO0FBQ3pELDRGQUFrRTtBQUNsRSxvQ0FBMEM7QUFFMUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBRS9CLE1BQU0sMEJBQTBCO0lBQzVCLFlBQWEsU0FBUztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0NBQ0o7QUFFRCxTQUFTO0FBQ1QsTUFBYSxZQUFhLFNBQVEsS0FBSztJQUNuQyxZQUFhLEdBQUcsSUFBSTtRQUNoQixNQUFNLElBQUksR0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxRQUFRLEdBQUcsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqQyxLQUFLLENBQUMseUJBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXpDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNKO0FBVkQsb0NBVUM7QUFFRCxNQUFhLG9CQUFxQixTQUFRLEtBQUs7SUFDM0MsWUFBYSxhQUFhO1FBQ3RCLE1BQU0sUUFBUSxHQUFPLG1CQUFTLENBQUMsc0JBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU5QyxLQUFLLENBQUMseUJBQWMsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFD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QyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztDQUNKO0FBTkQsd0RBTUM7QUFFRCxNQUFhLGNBQWUsU0FBUSxLQUFLO0lBQ3JDLFlBQWEsTUFBTTtRQUNmLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxJQUFJLEdBQUksc0JBQWMsQ0FBQyx1QkFBdUIsQ0FBQztJQUN4RCxDQUFDO0NBQ0o7QUFQRCx3Q0FPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlcmVycyB9IGZyb20gJ2NhbGxzaXRlLXJlY29yZCc7XG5pbXBvcnQgVEVNUExBVEVTIGZyb20gJy4vdGVtcGxhdGVzJztcbmltcG9ydCBjcmVhdGVTdGFja0ZpbHRlciBmcm9tICcuLi9jcmVhdGUtc3RhY2stZmlsdGVyJztcbmltcG9ydCB7IGdldENhbGxzaXRlRm9yTWV0aG9kIH0gZnJvbSAnLi4vZ2V0LWNhbGxzaXRlJztcbmltcG9ydCByZW5kZXJUZW1wbGF0ZSBmcm9tICcuLi8uLi91dGlscy9yZW5kZXItdGVtcGxhdGUnO1xuaW1wb3J0IHJlbmRlckNhbGxzaXRlU3luYyBmcm9tICcuLi8uLi91dGlscy9yZW5kZXItY2FsbHNpdGUtc3luYyc7XG5pbXBvcnQgeyBSVU5USU1FX0VSUk9SUyB9IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgRVJST1JfU0VQQVJBVE9SID0gJ1xcblxcbic7XG5cbmNsYXNzIFByb2Nlc3NUZW1wbGF0ZUluc3RydWN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvciAocHJvY2Vzc0ZuKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0ZuID0gcHJvY2Vzc0ZuO1xuICAgIH1cbn1cblxuLy8gRXJyb3JzXG5leHBvcnQgY2xhc3MgR2VuZXJhbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yICguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgICAgID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRFTVBMQVRFU1tjb2RlXTtcblxuICAgICAgICBzdXBlcihyZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgLi4uYXJncykpO1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgeyBjb2RlLCBkYXRhOiBhcmdzIH0pO1xuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBHZW5lcmFsRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlc3RDb21waWxhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yIChvcmlnaW5hbEVycm9yKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlICAgICA9IFRFTVBMQVRFU1tSVU5USU1FX0VSUk9SUy5jYW5ub3RQcmVwYXJlVGVzdHNEdWVUb0Vycm9yXTtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gb3JpZ2luYWxFcnJvci50b1N0cmluZygpO1xuXG4gICAgICAgIHN1cGVyKHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCBlcnJvck1lc3NhZ2UpKTtcblxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgICAgIGNvZGU6IFJVTlRJTUVfRVJST1JTLmNhbm5vdFByZXBhcmVUZXN0c0R1ZVRvRXJyb3IsXG4gICAgICAgICAgICBkYXRhOiBbZXJyb3JNZXNzYWdlXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBOT1RFOiBzdGFjayBpbmNsdWRlcyBtZXNzYWdlIGFzIHdlbGwuXG4gICAgICAgIHRoaXMuc3RhY2sgPSByZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgb3JpZ2luYWxFcnJvci5zdGFjayk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQVBJRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IgKG1ldGhvZE5hbWUsIGNvZGUsIC4uLmFyZ3MpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gVEVNUExBVEVTW2NvZGVdO1xuXG4gICAgICAgIHRlbXBsYXRlID0gQVBJRXJyb3IuX3ByZXBhcmVUZW1wbGF0ZUFuZEFyZ3NJZk5lY2Vzc2FyeSh0ZW1wbGF0ZSwgYXJncyk7XG5cbiAgICAgICAgY29uc3QgcmF3TWVzc2FnZSA9IHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCAuLi5hcmdzKTtcblxuICAgICAgICBzdXBlcihyZW5kZXJUZW1wbGF0ZShURU1QTEFURVNbUlVOVElNRV9FUlJPUlMuY2Fubm90UHJlcGFyZVRlc3RzRHVlVG9FcnJvcl0sIHJhd01lc3NhZ2UpKTtcblxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsgY29kZSwgZGF0YTogYXJncyB9KTtcblxuICAgICAgICAvLyBOT1RFOiBgcmF3TWVzc2FnZWAgaXMgdXNlZCBpbiBlcnJvciBzdWJzdGl0dXRpb24gaWYgaXQgb2NjdXJzIGluIHRlc3QgcnVuLlxuICAgICAgICB0aGlzLnJhd01lc3NhZ2UgPSByYXdNZXNzYWdlO1xuICAgICAgICB0aGlzLmNhbGxzaXRlICAgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZChtZXRob2ROYW1lKTtcblxuICAgICAgICAvLyBOT1RFOiBXZSBuZWVkIHByb3BlcnR5IGdldHRlcnMgaGVyZSBiZWNhdXNlIGNhbGxzaXRlIGNhbiBiZSByZXBsYWNlZCBieSBhbiBleHRlcm5hbCBjb2RlLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0RldkV4cHJlc3MvdGVzdGNhZmUvYmxvYi92MS4wLjAvc3JjL2NvbXBpbGVyL3Rlc3QtZmlsZS9mb3JtYXRzL3Jhdy5qcyNMMjJcbiAgICAgICAgLy8gQWxzbyB3ZSBjYW4ndCB1c2UgYW4gRVM2IGdldHRlciBmb3IgdGhlICdzdGFjaycgcHJvcGVydHksIGJlY2F1c2UgaXQgd2lsbCBjcmVhdGUgYSBnZXR0ZXIgb24gdGhlIGNsYXNzIHByb3RvdHlwZVxuICAgICAgICAvLyB0aGF0IGNhbm5vdCBvdmVycmlkZSB0aGUgaW5zdGFuY2UgcHJvcGVydHkgY3JlYXRlZCBieSB0aGUgRXJyb3IgcGFyZW50IGNsYXNzLlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAgICAgICAnc3RhY2snOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLl9jcmVhdGVTdGFjayhyZW5kZXJlcnMubm9Db2xvcilcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICdjb2xvcmVkU3RhY2snOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLl9jcmVhdGVTdGFjayhyZW5kZXJlcnMuZGVmYXVsdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZVN0YWNrIChyZW5kZXJlcikge1xuICAgICAgICBjb25zdCByZW5kZXJlZENhbGxzaXRlID0gcmVuZGVyQ2FsbHNpdGVTeW5jKHRoaXMuY2FsbHNpdGUsIHtcbiAgICAgICAgICAgIHJlbmRlcmVyOiAgICByZW5kZXJlcixcbiAgICAgICAgICAgIHN0YWNrRmlsdGVyOiBjcmVhdGVTdGFja0ZpbHRlcihFcnJvci5zdGFja1RyYWNlTGltaXQpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghcmVuZGVyZWRDYWxsc2l0ZSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZSArIEVSUk9SX1NFUEFSQVRPUiArIHJlbmRlcmVkQ2FsbHNpdGU7XG4gICAgfVxuXG4gICAgc3RhdGljIF9wcmVwYXJlVGVtcGxhdGVBbmRBcmdzSWZOZWNlc3NhcnkgKHRlbXBsYXRlLCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IGxhc3RBcmcgPSBhcmdzLnBvcCgpO1xuXG4gICAgICAgIGlmIChsYXN0QXJnIGluc3RhbmNlb2YgUHJvY2Vzc1RlbXBsYXRlSW5zdHJ1Y3Rpb24pXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IGxhc3RBcmcucHJvY2Vzc0ZuKHRlbXBsYXRlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXJncy5wdXNoKGxhc3RBcmcpO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDbGllbnRGdW5jdGlvbkFQSUVycm9yIGV4dGVuZHMgQVBJRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yIChtZXRob2ROYW1lLCBpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lLCBjb2RlLCAuLi5hcmdzKSB7XG4gICAgICAgIGFyZ3MucHVzaChuZXcgUHJvY2Vzc1RlbXBsYXRlSW5zdHJ1Y3Rpb24odGVtcGxhdGUgPT4gdGVtcGxhdGUucmVwbGFjZSgvXFx7I2luc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWVcXH0vZywgaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSkpKTtcblxuICAgICAgICBzdXBlcihtZXRob2ROYW1lLCBjb2RlLCAuLi5hcmdzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvciAoZXJyb3JzKSB7XG4gICAgICAgIHN1cGVyKGVycm9ycy5tYXAoKHsgbWVzc2FnZSB9KSA9PiBtZXNzYWdlKS5qb2luKEVSUk9SX1NFUEFSQVRPUikpO1xuXG4gICAgICAgIHRoaXMuc3RhY2sgPSBlcnJvcnMubWFwKCh7IHN0YWNrIH0pID0+IHN0YWNrKS5qb2luKEVSUk9SX1NFUEFSQVRPUik7XG4gICAgICAgIHRoaXMuY29kZSAgPSBSVU5USU1FX0VSUk9SUy5jb21wb3NpdGVBcmd1bWVudHNFcnJvcjtcbiAgICB9XG59XG4iXX0=