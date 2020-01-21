"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_run_1 = __importDefault(require("../test-run"));
const test_run_state_1 = __importDefault(require("./test-run-state"));
const type_1 = __importDefault(require("../test-run/commands/type"));
const service_1 = require("../test-run/commands/service");
const TEST_RUN_ABORTED_MESSAGE = 'The test run has been aborted.';
exports.TestRunCtorFactory = function (callbacks) {
    const { created, done, readyToNext } = callbacks;
    return class LiveModeTestRun extends test_run_1.default {
        constructor(test, browserConnection, screenshotCapturer, warningLog, opts) {
            super(test, browserConnection, screenshotCapturer, warningLog, opts);
            created(this, test);
            this.state = test_run_state_1.default.created;
            this.finish = null;
            this.stopping = false;
            this.isInRoleInitializing = false;
            this.stopped = false;
        }
        stop() {
            this.stopped = true;
        }
        _useRole(...args) {
            this.isInRoleInitializing = true;
            return super._useRole.apply(this, args)
                .then(res => {
                this.isInRoleInitializing = false;
                return res;
            })
                .catch(err => {
                this.isInRoleInitializing = false;
                throw err;
            });
        }
        executeCommand(commandToExec, callsite, forced) {
            // NOTE: don't close the page and the session when the last test in the queue is done
            if (commandToExec.type === type_1.default.testDone && !forced) {
                done(this, this.stopped)
                    .then(() => this.executeCommand(commandToExec, callsite, true))
                    .then(() => readyToNext(this));
                this.executeCommand(new service_1.UnlockPageCommand(), null);
                return Promise.resolve();
            }
            if (this.stopped && !this.stopping &&
                !this.isInRoleInitializing) {
                this.stopping = true;
                return Promise.reject(new Error(TEST_RUN_ABORTED_MESSAGE));
            }
            return super.executeCommand(commandToExec, callsite);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGl2ZS90ZXN0LXJ1bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJEQUFrQztBQUNsQyxzRUFBOEM7QUFDOUMscUVBQXFEO0FBQ3JELDBEQUFpRTtBQUVqRSxNQUFNLHdCQUF3QixHQUFHLGdDQUFnQyxDQUFDO0FBRXJELFFBQUEsa0JBQWtCLEdBQUcsVUFBVSxTQUFTO0lBQ2pELE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLFNBQVMsQ0FBQztJQUVqRCxPQUFPLE1BQU0sZUFBZ0IsU0FBUSxrQkFBTztRQUN4QyxZQUFhLElBQUksRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsSUFBSTtZQUN0RSxLQUFLLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVyRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXBCLElBQUksQ0FBQyxLQUFLLEdBQWtCLHdCQUFjLENBQUMsT0FBTyxDQUFDO1lBQ25ELElBQUksQ0FBQyxNQUFNLEdBQWlCLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFlLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQWdCLEtBQUssQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBSTtZQUNBLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7UUFFRCxRQUFRLENBQUUsR0FBRyxJQUFJO1lBQ2IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUVqQyxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7aUJBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDUixJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO2dCQUVsQyxPQUFPLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztnQkFFbEMsTUFBTSxHQUFHLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxjQUFjLENBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNO1lBQzNDLHFGQUFxRjtZQUNyRixJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssY0FBWSxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDekQsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUNuQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUM5RCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRW5DLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSwyQkFBaUIsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUVuRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM1QjtZQUVELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUM5QixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBRXJCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7YUFDOUQ7WUFFRCxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FDSixDQUFDO0FBQ04sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3RSdW4gZnJvbSAnLi4vdGVzdC1ydW4nO1xuaW1wb3J0IFRFU1RfUlVOX1NUQVRFIGZyb20gJy4vdGVzdC1ydW4tc3RhdGUnO1xuaW1wb3J0IENPTU1BTkRfVFlQRSBmcm9tICcuLi90ZXN0LXJ1bi9jb21tYW5kcy90eXBlJztcbmltcG9ydCB7IFVubG9ja1BhZ2VDb21tYW5kIH0gZnJvbSAnLi4vdGVzdC1ydW4vY29tbWFuZHMvc2VydmljZSc7XG5cbmNvbnN0IFRFU1RfUlVOX0FCT1JURURfTUVTU0FHRSA9ICdUaGUgdGVzdCBydW4gaGFzIGJlZW4gYWJvcnRlZC4nO1xuXG5leHBvcnQgY29uc3QgVGVzdFJ1bkN0b3JGYWN0b3J5ID0gZnVuY3Rpb24gKGNhbGxiYWNrcykge1xuICAgIGNvbnN0IHsgY3JlYXRlZCwgZG9uZSwgcmVhZHlUb05leHQgfSA9IGNhbGxiYWNrcztcblxuICAgIHJldHVybiBjbGFzcyBMaXZlTW9kZVRlc3RSdW4gZXh0ZW5kcyBUZXN0UnVuIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHRlc3QsIGJyb3dzZXJDb25uZWN0aW9uLCBzY3JlZW5zaG90Q2FwdHVyZXIsIHdhcm5pbmdMb2csIG9wdHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHRlc3QsIGJyb3dzZXJDb25uZWN0aW9uLCBzY3JlZW5zaG90Q2FwdHVyZXIsIHdhcm5pbmdMb2csIG9wdHMpO1xuXG4gICAgICAgICAgICBjcmVhdGVkKHRoaXMsIHRlc3QpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlICAgICAgICAgICAgICAgID0gVEVTVF9SVU5fU1RBVEUuY3JlYXRlZDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoICAgICAgICAgICAgICAgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zdG9wcGluZyAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc0luUm9sZUluaXRpYWxpemluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdG9wcGVkICAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3VzZVJvbGUgKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuaXNJblJvbGVJbml0aWFsaXppbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX3VzZVJvbGUuYXBwbHkodGhpcywgYXJncylcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzSW5Sb2xlSW5pdGlhbGl6aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzSW5Sb2xlSW5pdGlhbGl6aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhlY3V0ZUNvbW1hbmQgKGNvbW1hbmRUb0V4ZWMsIGNhbGxzaXRlLCBmb3JjZWQpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IGRvbid0IGNsb3NlIHRoZSBwYWdlIGFuZCB0aGUgc2Vzc2lvbiB3aGVuIHRoZSBsYXN0IHRlc3QgaW4gdGhlIHF1ZXVlIGlzIGRvbmVcbiAgICAgICAgICAgIGlmIChjb21tYW5kVG9FeGVjLnR5cGUgPT09IENPTU1BTkRfVFlQRS50ZXN0RG9uZSAmJiAhZm9yY2VkKSB7XG4gICAgICAgICAgICAgICAgZG9uZSh0aGlzLCB0aGlzLnN0b3BwZWQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuZXhlY3V0ZUNvbW1hbmQoY29tbWFuZFRvRXhlYywgY2FsbHNpdGUsIHRydWUpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZWFkeVRvTmV4dCh0aGlzKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGVDb21tYW5kKG5ldyBVbmxvY2tQYWdlQ29tbWFuZCgpLCBudWxsKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcHBlZCAmJiAhdGhpcy5zdG9wcGluZyAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmlzSW5Sb2xlSW5pdGlhbGl6aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wcGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFRFU1RfUlVOX0FCT1JURURfTUVTU0FHRSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZXhlY3V0ZUNvbW1hbmQoY29tbWFuZFRvRXhlYywgY2FsbHNpdGUpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iXX0=