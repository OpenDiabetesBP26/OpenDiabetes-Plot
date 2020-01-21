"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = __importDefault(require("./type"));
const base_1 = __importDefault(require("./base"));
const argument_1 = require("./validations/argument");
// Commands
class WaitCommand extends base_1.default {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.wait);
    }
    _getAssignableProperties() {
        return [
            { name: 'timeout', type: argument_1.positiveIntegerArgument, required: true }
        ];
    }
}
exports.WaitCommand = WaitCommand;
class ExecuteClientFunctionCommandBase extends base_1.default {
    constructor(obj, testRun, type) {
        super(obj, testRun, type, false);
    }
    _getAssignableProperties() {
        return [
            { name: 'instantiationCallsiteName', defaultValue: '' },
            { name: 'fnCode', defaultValue: '' },
            { name: 'args', defaultValue: [] },
            { name: 'dependencies', defaultValue: [] }
        ];
    }
}
class ExecuteClientFunctionCommand extends ExecuteClientFunctionCommandBase {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.executeClientFunction);
    }
}
exports.ExecuteClientFunctionCommand = ExecuteClientFunctionCommand;
class ExecuteSelectorCommand extends ExecuteClientFunctionCommandBase {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.executeSelector);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'visibilityCheck', defaultValue: false },
            { name: 'timeout', defaultValue: null },
            { name: 'apiFnChain' },
            { name: 'needError' },
            { name: 'index', defaultValue: 0 }
        ]);
    }
}
exports.ExecuteSelectorCommand = ExecuteSelectorCommand;
class DebugCommand {
    constructor() {
        this.type = type_1.default.debug;
    }
}
exports.DebugCommand = DebugCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdC1ydW4vY29tbWFuZHMvb2JzZXJ2YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsa0RBQWlDO0FBQ2pDLHFEQUFpRTtBQUVqRSxXQUFXO0FBQ1gsTUFBYSxXQUFZLFNBQVEsY0FBVztJQUN4QyxZQUFhLEdBQUcsRUFBRSxPQUFPO1FBQ3JCLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsd0JBQXdCO1FBQ3BCLE9BQU87WUFDSCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGtDQUF1QixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7U0FDckUsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQVZELGtDQVVDO0FBRUQsTUFBTSxnQ0FBaUMsU0FBUSxjQUFXO0lBQ3RELFlBQWEsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQzNCLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsd0JBQXdCO1FBQ3BCLE9BQU87WUFDSCxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFO1lBQ3ZELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFO1lBQ3BDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFO1lBQ2xDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFO1NBQzdDLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFFRCxNQUFhLDRCQUE2QixTQUFRLGdDQUFnQztJQUM5RSxZQUFhLEdBQUcsRUFBRSxPQUFPO1FBQ3JCLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLGNBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDSjtBQUpELG9FQUlDO0FBRUQsTUFBYSxzQkFBdUIsU0FBUSxnQ0FBZ0M7SUFDeEUsWUFBYSxHQUFHLEVBQUUsT0FBTztRQUNyQixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELHdCQUF3QjtRQUNwQixPQUFPLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUMzQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFO1lBQ2hELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFO1lBQ3ZDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUN0QixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDckIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUU7U0FDckMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBZEQsd0RBY0M7QUFFRCxNQUFhLFlBQVk7SUFDckI7UUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQUksQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBSkQsb0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVFlQRSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IENvbW1hbmRCYXNlIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyBwb3NpdGl2ZUludGVnZXJBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdGlvbnMvYXJndW1lbnQnO1xuXG4vLyBDb21tYW5kc1xuZXhwb3J0IGNsYXNzIFdhaXRDb21tYW5kIGV4dGVuZHMgQ29tbWFuZEJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHRlc3RSdW4pIHtcbiAgICAgICAgc3VwZXIob2JqLCB0ZXN0UnVuLCBUWVBFLndhaXQpO1xuICAgIH1cblxuICAgIF9nZXRBc3NpZ25hYmxlUHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7IG5hbWU6ICd0aW1lb3V0JywgdHlwZTogcG9zaXRpdmVJbnRlZ2VyQXJndW1lbnQsIHJlcXVpcmVkOiB0cnVlIH1cbiAgICAgICAgXTtcbiAgICB9XG59XG5cbmNsYXNzIEV4ZWN1dGVDbGllbnRGdW5jdGlvbkNvbW1hbmRCYXNlIGV4dGVuZHMgQ29tbWFuZEJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHRlc3RSdW4sIHR5cGUpIHtcbiAgICAgICAgc3VwZXIob2JqLCB0ZXN0UnVuLCB0eXBlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2luc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUnLCBkZWZhdWx0VmFsdWU6ICcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdmbkNvZGUnLCBkZWZhdWx0VmFsdWU6ICcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhcmdzJywgZGVmYXVsdFZhbHVlOiBbXSB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZGVwZW5kZW5jaWVzJywgZGVmYXVsdFZhbHVlOiBbXSB9XG4gICAgICAgIF07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhlY3V0ZUNsaWVudEZ1bmN0aW9uQ29tbWFuZCBleHRlbmRzIEV4ZWN1dGVDbGllbnRGdW5jdGlvbkNvbW1hbmRCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqLCB0ZXN0UnVuKSB7XG4gICAgICAgIHN1cGVyKG9iaiwgdGVzdFJ1biwgVFlQRS5leGVjdXRlQ2xpZW50RnVuY3Rpb24pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4ZWN1dGVTZWxlY3RvckNvbW1hbmQgZXh0ZW5kcyBFeGVjdXRlQ2xpZW50RnVuY3Rpb25Db21tYW5kQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdGVzdFJ1bikge1xuICAgICAgICBzdXBlcihvYmosIHRlc3RSdW4sIFRZUEUuZXhlY3V0ZVNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzKCkuY29uY2F0KFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3Zpc2liaWxpdHlDaGVjaycsIGRlZmF1bHRWYWx1ZTogZmFsc2UgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3RpbWVvdXQnLCBkZWZhdWx0VmFsdWU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2FwaUZuQ2hhaW4nIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICduZWVkRXJyb3InIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdpbmRleCcsIGRlZmF1bHRWYWx1ZTogMCB9XG4gICAgICAgIF0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBUWVBFLmRlYnVnO1xuICAgIH1cbn1cblxuIl19